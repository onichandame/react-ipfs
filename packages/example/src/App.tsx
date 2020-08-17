import React from 'react'
import logo from './logo.svg'
import './App.css'
import { useCount } from 'react-hook'

function App() {
  const { val } = useCount()
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
        <h3>{val}</h3>
      </header>
    </div>
  )
}

export default App
