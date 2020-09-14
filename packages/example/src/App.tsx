import React, { useState, useReducer } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useIpfs } from 'react-ipfs-hook'
import { Grid, Typography } from '@material-ui/core'

import { Panel, NavBar } from './components'
import { External, ExternalUrl } from './context'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

function App() {
  const styles = useStyles()
  const [externalUrl, setExternalUrl] = useState<string>(
    `http://localhost:5001`
  )
  const [external, toggleExternal] = useReducer(old => !old, true)
  const [ipfs, ipfsErr] = useIpfs({ external, opts: externalUrl })
  return (
    <ExternalUrl.Provider value={{ setExternalUrl, externalUrl }}>
      <External.Provider value={{ external, toggleExternal }}>
        <div className={styles.root}>
          <NavBar />
          <Grid container spacing={2} direction={'column'} alignItems="center">
            <Grid item>
              <Typography variant="h5">{`${
                external ? `External` : `Embedded`
              } IPFS Node`}</Typography>
            </Grid>
            <Grid item>
              {(ipfsErr && ipfsErr.message) || <Panel ipfs={ipfs} />}
            </Grid>
          </Grid>
        </div>
      </External.Provider>
    </ExternalUrl.Provider>
  )
}

export default App
