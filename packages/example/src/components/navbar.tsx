import React, { FC, useState, useEffect } from 'react'
import {
  SignalCellular0Bar,
  SignalCellular1Bar,
  SignalCellular2Bar,
  SignalCellular3Bar,
  SignalCellular4Bar,
  SignalCellularConnectedNoInternet0Bar,
} from '@material-ui/icons'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { useIpfs } from 'react-ipfs-hook'

const SignalIcon: FC<{ number: number }> = ({ number }) => {
  return number <= 0 ? (
    <SignalCellularConnectedNoInternet0Bar />
  ) : number < 10 ? (
    <SignalCellular0Bar />
  ) : number < 64 ? (
    <SignalCellular1Bar />
  ) : number < 128 ? (
    <SignalCellular2Bar />
  ) : number < 256 ? (
    <SignalCellular3Bar />
  ) : (
    <SignalCellular4Bar />
  )
}

export const NavBar: FC = () => {
  const [ipfs, ipfsErr] = useIpfs()
  const [peers, setPeers] = useState(0)
  useEffect(() => {
    const job = setInterval(() => {
      if (ipfs && !ipfsErr) {
        ipfs.swarm.peers().then((prs: any[]) => {
          setPeers(prs.length)
        })
      }
    }, 1000)
    return () => {
      clearInterval(job)
    }
  }, [ipfs, ipfsErr])
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap>
          IPFS
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <SignalIcon number={peers} />
      </Toolbar>
    </AppBar>
  )
}
