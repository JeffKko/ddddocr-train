import axios from 'axios'

export async function downloadCaptchaToBase64(
  path: string = '/ticket/captcha',
) {
  const endpoint = 'https://tixcraft.com'
  const { data } = await axios.get(`${endpoint}${path}`, {
    responseType: 'arraybuffer',
  });

  return Buffer.from(data, 'binary').toString('base64');
}

const apiEndpoint = 'https://ocr-a5xzo2fkma-de.a.run.app';

export const requestOCR = async (imageBase64: string) => {
  try {
    const payload = {
      image: imageBase64,
    };
    const { data } = await axios.post(apiEndpoint, payload);

    return [null, data];
  } catch (error) {
    return [error as Error];
  }
};

// https://tixcraft.com/ticket/captcha?v=64401516f053c1.41409332

// {
//   "hash1": 1582,
//   "hash2": 1582,
//   "url": "/ticket/captcha?v=64401516f053c1.41409332"
// }
export const getCapchaBase64ByRefresh = async () => {
  const {data} = await axios.get<{
    hash1: number,
    hash2: number,
    url: string
  }>(`https://tixcraft.com/ticket/captcha?refresh=1&_=${Date.now()}`)

  return data.url
}

export const getRefreshCaptchaFromPython = async () => {
  const {data} = await axios.get<{
    // hash1: number,
    // hash2: number,
    base64: string
  }>(`http://127.0.0.1:5000/api/refresh`)

  return data.base64
}

export const sendCaptchaAnswer = async (imageBase64: string, code: string) => {

  const payload = {
    imageBase64,
    code,
  }
  const {data} = await axios.post<{
    message: string
  }>(`http://127.0.0.1:5000/api/save`, payload)

  return data.message
}

interface Result {
  "errorId": number,
  "status": 'processing' | 'ready',
  "solution":
      {
          "text":string,
          "url":string
      },
  "cost":string,
  "ip":string,
  "createTime":number,
  "endTime":number,
  "solveCount":string
}

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

export const getResult = async (taskId: number): Promise<Result> => {
  const payload = {
    clientKey: 'aeb8ff6eea25c5542fab1d5ef1ea7f69',
    taskId,
  }

  const {data} = await axios.post<Result>('https://api.anti-captcha.com/getTaskResult', payload)

   console.log('data: ', data)

   if (data.status === 'processing') {
      await sleep(2000)

      const data = await getResult(taskId)

      return data
   }

   return data
}

export const createTask = async (imageBase64: string) => {
  const payload = {
    clientKey: 'aeb8ff6eea25c5542fab1d5ef1ea7f69',
    task: {
      "type":"ImageToTextTask",
      "body": imageBase64,
      "phrase":false,
      "case":false,
      "numeric":2,
      "math":false,
      "minLength":4,
      "maxLength":4
    },
    softId: 0,
  }

  const {data} = await axios.post<{
    "errorId": number,
    "taskId": number
   }>('https://api.anti-captcha.com/createTask', payload)

  console.log('data: ', data)

  return data
}
