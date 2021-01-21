import React from 'react'
import ReactDOM from 'react-dom'
import { CssBaseline } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import { IpfsProvider } from '@onichandame/react-ipfs-hook'

import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <React.StrictMode>
    <>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <IpfsProvider mode="external" args={{ host: `localhost`, port: 5001 }}>
          <App />
        </IpfsProvider>
      </SnackbarProvider>
    </>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
