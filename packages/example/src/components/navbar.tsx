import React, { useContext, MouseEvent, FC, useState } from 'react'
import { v4 as randStr } from 'uuid'
import {
  Group,
  SignalCellular0Bar,
  SignalCellular1Bar,
  SignalCellular2Bar,
  SignalCellular3Bar,
  SignalCellular4Bar,
  SignalCellularConnectedNoInternet0Bar,
} from '@material-ui/icons'
import {
  Grid,
  Menu,
  Divider,
  Badge,
  MenuItem,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { useIpfs } from '@onichandame/react-ipfs-hook'

import { Peers, PeerNum } from '../context'

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
  const ipfsPromise = useIpfs()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [peersAnchor, setPeersAnchor] = useState<HTMLElement | null>(null)
  const [menuId] = useState(randStr())
  const [peersId] = useState(randStr())
  const [showNum] = useState(10)
  const peerNum = useContext(PeerNum)
  const peers = useContext(Peers)

  const openMenu = (e: MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget)
  }
  const closeMenu = () => {
    setMenuAnchor(null)
  }

  const openPeers = (e: MouseEvent<HTMLElement>) => {
    setPeersAnchor(e.currentTarget)
  }
  const closePeers = () => {
    setPeersAnchor(null)
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap>
            IPFS
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            aria-label="ipfs peers"
            aria-controls={peersId}
            aria-haspopup="true"
            onClick={openPeers}
          >
            <Badge badgeContent={peerNum}>
              <Group />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="ipfs node"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={openMenu}
          >
            <SignalIcon number={peerNum} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={menuAnchor}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        open={!!menuAnchor}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            closeMenu()
            ipfsPromise.then(ipfs => ipfs && ipfs.stop())
          }}
        >
          Stop
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={peersAnchor}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={peersId}
        keepMounted
        open={!!peersAnchor}
        onClose={closePeers}
      >
        <MenuItem onClick={closePeers}>
          <Grid container direction="row" justify="space-between">
            <Grid item></Grid>
            <Grid item>total number: {peerNum}</Grid>
          </Grid>
        </MenuItem>
        <Divider />
        {peers.slice(0, showNum).map(peer => (
          <MenuItem
            key={randStr()}
            onClick={() => {
              closePeers()
            }}
          >
            {peer.addr.toString()}
          </MenuItem>
        ))}
        <Divider />
        {peerNum > showNum && (
          <MenuItem>
            <Grid container direction="row" justify="space-around">
              <Grid item>more</Grid>
            </Grid>
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}
