import { useState, useCallback, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import axios from 'axios'
import {getRefreshCaptchaFromPython, sendCaptchaAnswer , createTask, getResult} from '../lib'

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

function App() {
  const [count, setCount] = useState(0)
  const [imageBase64, setImageBase64] = useState('')
  const [code, setCode] = useState('')
  const [filename, setFilename] = useState('')
  const inputRef = useRef<any>()

  const handleGetUncheckData = async() => {

    const {data} = await axios.get<{
      base64_data: string,
      filename: string
    }>('http://127.0.0.1:5000/api/get-uncheck')

    console.log(data)

    // setImageBase64(res)

    return data
  }

  const signAnswer = useCallback(async() => {

    const payload = {
      imageBase64,
      code,
      filename,
    }

    const {data} = await axios.post('http://127.0.0.1:5000/api/sign-uncheck', payload)

    console.log(data)
  }, [imageBase64, code, filename])


  const handleClick = async ()=> {
    const {
      base64_data,
      filename,
    } = await handleGetUncheckData()

    const code = filename.split('_')[0]

    setFilename(filename)
    setCode(code)
    setImageBase64(base64_data)
  }

  const handleChange = async (value: string) => {
    setCode(value)
  }

  useEffect(() => {
    const sendAnswerByKeyboard = async (e:any) => {
      const key = (e.which && e.which) || e.keyCode();

      if (key === 13) {
      // if (code && imageBase64) {
        console.log('Enter pressed');

        await signAnswer()

        setImageBase64('')
        setCode('')

        handleClick()
      // }
      }
    };

    window.addEventListener('keydown', sendAnswerByKeyboard);

    return () => {
      window.removeEventListener('keydown', sendAnswerByKeyboard);
    };
  }, [signAnswer])

  return (
    <div className="App">
       <button onClick={handleClick}>
          get captcha
        </button>
      <div>
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
        <img src={`data:image/png;base64,${imageBase64}`} width="256" height="auto" alt=""/>
      </div>
      {/* <h1>Vite + React</h1> */}
      <div className="card">
        {/* <button onClick={handleClick}>
          get captcha
        </button> */}
        <p>
          {/* Edit <code>src/App.tsx</code> and save to test <HMR></HMR> */}
        </p>
        <input ref={inputRef} type="text" style={{fontSize: '60px', width: '200px'}} value={code} onChange={(e: any) => handleChange(e.target.value)}/>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
