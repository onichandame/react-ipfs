import React, { MouseEvent, useState, useContext, FC } from 'react'
import { useSnackbar } from 'notistack'
import {
  Badge,
  IconButton,
  Divider,
  Typography,
  Grid,
  Toolbar,
  Menu,
  MenuItem,
  AppBar,
  Dialog,
  DialogTitle,
} from '@material-ui/core'
import {
  Group,
  SignalCellularConnectedNoInternet0Bar,
  SignalCellular0Bar,
  SignalCellular1Bar,
  SignalCellular2Bar,
  SignalCellular3Bar,
  SignalCellular4Bar,
} from '@material-ui/icons'

import { Id, Peers, PeerNum } from '../../contexts'
import { randStr } from '../../utils'
import { useIpfs } from '../../../src'

import { PeersList } from './peersList'

export const NavBar: FC = () => {
  const { ipfs } = useIpfs()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [peersAnchor, setPeersAnchor] = useState<HTMLElement | null>(null)
  const [menuId] = useState(randStr())
  const [peersId] = useState(randStr())
  const [showNum] = useState(10)
  const [peerListOpen, setPeerListOpen] = useState(false)
  const peerNum = useContext(PeerNum)
  const peers = useContext(Peers)
  const id = useContext(Id)
  const { enqueueSnackbar } = useSnackbar()

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
              <Group color={peerNum === 0 ? `error` : `inherit`} />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="ipfs node"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={openMenu}
          >
            {peerNum <= 0 ? (
              <SignalCellularConnectedNoInternet0Bar color="error" />
            ) : peerNum < 10 ? (
              <SignalCellular0Bar />
            ) : peerNum < 64 ? (
              <SignalCellular1Bar />
            ) : peerNum < 128 ? (
              <SignalCellular2Bar />
            ) : peerNum < 256 ? (
              <SignalCellular3Bar />
            ) : (
              <SignalCellular4Bar />
            )}
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
          onClick={e => {
            e.preventDefault()
            closeMenu()
            navigator.clipboard.writeText(id)
            enqueueSnackbar(`id clipped to clipboard!`, { variant: `success` })
          }}
        >
          my id: {id}
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu()
            ipfs.stop()
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
          <Grid container direction="row" spacing={2} justify="space-around">
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
          <MenuItem
            onClick={e => {
              e.preventDefault()
              closePeers()
              setPeerListOpen(true)
            }}
          >
            <Grid container direction="row" justify="space-around">
              <Grid item>more</Grid>
            </Grid>
          </MenuItem>
        )}
      </Menu>
      <Dialog open={peerListOpen} onClose={() => setPeerListOpen(false)}>
        <DialogTitle>Peers</DialogTitle>
        <PeersList />
      </Dialog>
    </div>
  )
}
