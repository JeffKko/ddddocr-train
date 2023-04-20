import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

let count = 0

main()

async function main() {
  const tixSourceFolder = './images_tix/';

  const res = await fs.readFileSync('./sign_tix.txt', {encoding: 'utf-8'})

  const list = res.split('\n')

  console.log(list)

  let count = 0

  for (const filename of list) {
    const [ans, sourceName] = filename.split('_')

    console.log(`${count} ${filename}`)
    count += 1

    const captcha = fs.readFileSync(`./images_tix/${sourceName}`, {
      encoding: 'base64',
    });

    fs.writeFileSync(`./image_tix_sign/${filename}`, captcha, {encoding: 'base64'})
  }

  // fs.readdir(tixSourceFolder, async(err, filesList) => {

  //   for (const file of filesList) {
  //     if (!file.includes('.jpg')) {
  //       continue
  //     }
  //     // console.log(file);

  //     const ans = file.split('_')[0]

  //     const currentFile = `${tixSourceFolder}${file}`


  //     const captcha = fs.readFileSync(`./images/${file}`, {
  //       encoding: 'base64',
  //     });

  //     fs.writeFileSync(`result_${Date.now()}.txt`, wrongList.join('\n'))
  //   }
  // });
}

function saveCaptcha (path: string) {
  return new Promise(resolve => {
     axios
      .get('https://tixcraft.com/ticket/captcha', {
        responseType: 'stream',
      })
      .then(response => {
        console.log('downloadCaptchaImage: finished');

        response.data.pipe(fs.createWriteStream(path).on('close', resolve));
      });
  })
}


const sleep = (t: number) => new Promise(r => setTimeout(r, t))

async function sign() {

  await axios.get(`https://tixcraft.com/ticket/captcha?refresh=1&_=${Date.now()}`)

  await saveCaptcha(`./images_tix/${Date.now()}.jpg`)

  await sleep(500)

  main()
}

interface CodeItem {
  ans: string
  code: string
  id: number
}

interface Res {
  codelist: CodeItem[],
  ret: number,
}

// async function test(csrf: string) {
//   const { data } = await axios.get<Res>('https://gen.caca01.com/rd/test', {
//     headers: {
//       referer: 'https://gen.caca01.com/ttcode/codeking',
//       'x-csrf-token': csrf,
//       'x-requested-with': 'XMLHttpRequest',
//     }
//   })

//   console.log(data)

//   const codeList = data.codelist

//   for (const obj of codeList) {
//     await sleep(1)

//     const timestamp = Date.now()

//     fs.writeFileSync(`./images/${obj.ans}_${timestamp}.jpg`, obj.code, { encoding: 'base64' });

//     count +=1

//     console.log('count: ', count)
//   }


//   await sleep(2000)

//   if (count >= 20000) {
//     return
//   } else {
//     main()
//   }
// }