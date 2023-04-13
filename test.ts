
import fs from 'fs';
import Ddddocr from 'ddddocr';




export const useDdddocr = async (
  path: string,
  options?: {
    onnxPath?: string;
    charsetsPath?: string;
  },
) => {
  try {
    const t1 = Date.now();

    const init = Ddddocr.create({
      onnxPath: './models/tixcraftv3_0.6666666666666666_14100_423000_2023-04-13-09-40-09.onnx',
      charsetsPath: './models/charsets.json',
    });

    const ddddocr = await init;
    const captcha = fs.readFileSync(path, {
      encoding: 'base64',
    });
    const result = await ddddocr.classification(Buffer.from(captcha, 'base64'));

    const t2 = Date.now();

    console.log(`驗證碼破解時間: ${(t2 - t1) / 1000} s`);

    return result;
  } catch (error) {
    console.log('useDdddocr error', error);
    throw error;
  }
};

// const verifyCode = await useDdddocr(imagePath, {
//   onnxPath,
// });


const testFolder = './images/';

let rightCount = 0
let wrongCount = 0
let totalCount = 0

let wrongList: string[] = []

fs.readdir(testFolder, async(err, filesList) => {

  for (const file of filesList) {
    if (!file.includes('.jpg')) {
      continue
    }
    // console.log(file);

    const ans = file.split('_')[0]

    const currentFile = `${testFolder}${file}`

    totalCount += 1

    console.log(`${totalCount} ${currentFile}`)

    const guessAns = await useDdddocr(`./images/${file}`)

    if (ans === guessAns) {
      rightCount += 1
    } else {
      wrongCount += 1

      wrongList.push(`${guessAns} ${file}`)
    }
  }

  // files.forEach(async file => {

  //   console.log(file);

  //   const ans = file.split('_')[0]

  //   const guessAns = await useDdddocr(`./images/${file}`)

  //   if (ans === guessAns) {
  //     rightCount += 1
  //   } else {
  //     wrongCount += 1

  //     wrongList.push(`${guessAns} ${file}`)
  //   }
  // });

  console.log('rightCount: ', rightCount)
  console.log('wrongCount: ', wrongCount)

  fs.writeFileSync(`result_${Date.now()}.txt`, wrongList.join('\n'))
});