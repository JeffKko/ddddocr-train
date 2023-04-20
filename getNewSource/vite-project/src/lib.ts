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