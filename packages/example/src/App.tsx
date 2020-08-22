import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import { useIpfs } from 'react-ipfs-hook'

function App() {
  const [ipfs, error] = useIpfs()
  const [id, setId] = useState<string>(``)
  useEffect(() => {
    if (ipfs) {
      ipfs?.id().then((id) => setId(id.id))
    }
  }, [ipfs])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h3>{error ? `error` : ipfs ? id : `loading`}</h3>
      </header>
    </div>
  )
}

export default App
