import { useState, useCallback, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AntiCaptcha from './components/AntiCaptcha'
import SignUncheck from './components/SignUncheck'

function App() {
  const [route, setRoute] = useState<'' | 'AntiCaptcha' | 'SignUncheck'>('')

  return (
    <>
    {
      route === 'AntiCaptcha'
      ? <AntiCaptcha />
      : route === 'SignUncheck'
        ? <SignUncheck />
        :
      <div className="App">
          <button onClick={() => setRoute('AntiCaptcha')}>
            Go AntiCaptcha
          </button>
          <button onClick={() => setRoute('SignUncheck')}>
            Go SignUncheck
          </button>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    }
    </>
  )
}

export default App
