import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import {getRefreshCaptchaFromPython} from './lib'

function App() {
  const [count, setCount] = useState(0)
  const [imageBase64, setImageBase64] = useState('')

  const handleClick = async ()=> {
    const res = await getRefreshCaptchaFromPython()

    console.log(res)

    setImageBase64(res)
  }

  return (
    <div className="App">
      <div>
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
        <img src={`data:image/png;base64,${imageBase64}`} alt=""/>
      </div>
      <h1>Vite + React</h1>
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
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
