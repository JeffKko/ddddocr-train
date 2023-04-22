import {getRefreshCaptchaFromPython, sendCaptchaAnswerUncheck , createTask, getResult} from '../lib'


let count = 0;

(async() => {
  await main()
})()


async function main() {

  console.log('count: ', count)

  await newImage()

  count += 1

  await main()
}

async function newImage() {
  const imageBase64 = await getRefreshCaptchaFromPython(2)

  const {taskId} = await createTask(imageBase64)

  const result = await getResult(taskId)

  console.log('result: ', result.solution.text)

  if (result.solution && result.solution.text) {
    await sendCaptchaAnswerUncheck(imageBase64, result.solution.text)
  }
}