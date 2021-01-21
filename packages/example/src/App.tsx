import React, { ContextType, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useIpfs } from '@onichandame/react-ipfs-hook'
import { Grid } from '@material-ui/core'

import { Panel, NavBar } from './components'
import { PeerNum, Peers, Id, Status } from './context'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

function App() {
  const styles = useStyles()
  const ipfsPromise = useIpfs()
  const [status, setStatus] = useState<ContextType<typeof Status>>(`UNKOWN`)
  const [id, setId] = useState(``)
  const [peers, setPeers] = useState<ContextType<typeof Peers>>([])
  const [peerNum, setPeerNum] = useState(0)

  // update ipfs status
  useEffect(() => {
    ipfsPromise.then(() => setStatus(`RUNNING`))
    ipfsPromise.catch((e: Error) => {
      setStatus(`ERROR`)
      throw e
    })
  }, [ipfsPromise])

  // update basic info regularly
  useEffect(() => {
    const reset = () => {
      setId(``)
      setPeers([])
    }
    let jobs: ReturnType<typeof setInterval>[] = []
    switch (status) {
      case `RUNNING`:
        ipfsPromise.then((ipfs: any) => {
          if (ipfs && ipfs.id)
            ipfs.id().then(({ id }: { id: string }) => setId(id))
        })
        ipfsPromise.then((ipfs: any) => {
          if (ipfs && ipfs.swarm && ipfs.swarm.peers)
            jobs.push(
              setInterval(() => {
                ipfs.swarm.peers().then((prs: any[]) => setPeers(prs))
              }, 1000)
            )
          ipfs.id().then(({ id }: { id: string }) => setId(id))
        })
        break
      default:
        reset()
    }
    return () => jobs.forEach(job => clearInterval(job))
  }, [status, ipfsPromise])

  useEffect(() => {
    const newPeerNum = peers.length
    if (newPeerNum !== peerNum) setPeerNum(newPeerNum)
  }, [peers, peerNum])
  return (
    <Peers.Provider value={peers}>
      <PeerNum.Provider value={peerNum}>
        <Id.Provider value={id}>
          <div className={styles.root}>
            <NavBar />
            <Grid
              container
              spacing={0}
              direction={'column'}
              alignItems="center"
            >
              <Grid item>{status === 'RUNNING' ? <Panel /> : `loading`}</Grid>
            </Grid>
          </div>
        </Id.Provider>
      </PeerNum.Provider>
    </Peers.Provider>
  )
}

export default App
