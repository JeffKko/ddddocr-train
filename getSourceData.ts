import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

let count = 0

main()


function main() {
  accessPage()
}

const sleep = (t: number) => new Promise(r => setTimeout(r, t))

async function accessPage() {
  const res = await axios.get('https://gen.caca01.com/ttcode/codeking')

  // console.log('res: ', res)

  const $ = cheerio.load(res.data)

  const csrf = $('meta[name="csrf-token"]').attr('content') ?? ''

  console.log(csrf)


  test(csrf)
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

async function test(csrf: string) {
  const { data } = await axios.get<Res>('https://gen.caca01.com/rd/test', {
    headers: {
      referer: 'https://gen.caca01.com/ttcode/codeking',
      'x-csrf-token': csrf,
      'x-requested-with': 'XMLHttpRequest',
    }
  })

  console.log(data)

  const codeList = data.codelist

  for (const obj of codeList) {
    await sleep(1)

    const timestamp = Date.now()

    fs.writeFileSync(`./images/${obj.ans}_${timestamp}.jpg`, obj.code, { encoding: 'base64' });

    count +=1

    console.log('count: ', count)
  }


  await sleep(2000)

  if (count >= 20000) {
    return
  } else {
    main()
  }
}