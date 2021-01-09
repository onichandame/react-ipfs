import React, { ContextType, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useIpfs } from 'react-ipfs-hook'
import { Grid } from '@material-ui/core'

import { Panel, NavBar } from './components'
import { Peers, Id } from './context'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

function App() {
  const styles = useStyles()
  const [ipfs, ipfsErr] = useIpfs()
  const [id, setId] = useState(``)
  const [peers, setPeers] = useState<ContextType<typeof Peers>>([])

  // update basic info regularly
  useEffect(() => {
    const reset = () => {
      setId(``)
      setPeers([])
    }
    const job = setInterval(() => {
      if (!ipfsErr && ipfs) {
        if (ipfs.isOnline()) {
          ipfs.id().then(({ id }: { id: string }) => setId(id))
          ipfs.swarm.peers().then((prs: any[]) => setPeers(prs))
        } else {
          reset()
        }
      } else {
        reset()
      }
    }, 1000)
    return () => clearInterval(job)
  }, [ipfs, ipfsErr])
  return (
    <Peers.Provider value={peers}>
      <Id.Provider value={id}>
        <div className={styles.root}>
          <NavBar />
          <Grid container spacing={0} direction={'column'} alignItems="center">
            <Grid item>
              {(ipfsErr && ipfsErr.message) || ipfs ? (
                <Panel ipfs={ipfs} />
              ) : (
                `loading`
              )}
            </Grid>
          </Grid>
        </div>
      </Id.Provider>
    </Peers.Provider>
  )
}

export default App
