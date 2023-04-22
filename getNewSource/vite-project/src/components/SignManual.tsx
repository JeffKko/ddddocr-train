import { useState, useCallback, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import {getRefreshCaptchaFromPython, sendCaptchaAnswer} from '../lib'

function App() {
  const [count, setCount] = useState(0)
  const [imageBase64, setImageBase64] = useState('')
  const [code, setCode] = useState('')
  const [route, setRoute] = useState<'' | 'AntiCaptcha' | 'SignUncheck'>('')
  const inputRef = useRef<any>()

  const handleGetNewCaptcha = async() => {

    const res = await getRefreshCaptchaFromPython()

    console.log(res)

    setImageBase64(res)
  }

  const sendAnswer = useCallback(async() => {

    const res = await sendCaptchaAnswer(imageBase64, code)

    console.log(res)
  }, [imageBase64, code])

  const handleClick = async ()=> {
    handleGetNewCaptcha()
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

        await sendAnswer()

        setImageBase64('')
        setCode('')

        handleGetNewCaptcha()
      // }
      }
    };

    window.addEventListener('keydown', sendAnswerByKeyboard);

    return () => {
      window.removeEventListener('keydown', sendAnswerByKeyboard);
    };
  }, [sendAnswer])

  return (
    <>
    {
      <div className="App">
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
          {/* <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button> */}
          <button onClick={handleClick}>
            get captcha
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
          <input ref={inputRef} type="text" style={{fontSize: '60px', width: '200px'}} value={code} onChange={(e: any) => handleChange(e.target.value)}/>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    }
    </>
  )
}

export default App
