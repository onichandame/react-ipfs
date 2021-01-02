import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useIpfs } from 'react-ipfs-hook'
import { Grid } from '@material-ui/core'

import { Panel, NavBar } from './components'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}))

function App() {
  const styles = useStyles()
  const [ipfs, ipfsErr] = useIpfs()
  return (
    <div className={styles.root}>
      <NavBar />
      <Grid container spacing={2} direction={'column'} alignItems="center">
        <Grid item>
          {(ipfsErr && ipfsErr.message) || ipfs ? (
            <Panel ipfs={ipfs} />
          ) : (
            `loading`
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default App
