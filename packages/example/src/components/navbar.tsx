import React, { useEffect, useContext, MouseEvent, FC, useState } from 'react'
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
  Menu,
  Badge,
  MenuItem,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { useIpfs } from '@onichandame/react-ipfs-hook'

import { Peers } from '../context'

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
  const [ipfs] = useIpfs()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [menuId] = useState(randStr())
  const [peerNum, setPeerNum] = useState(0)

  const peers = useContext(Peers)

  useEffect(() => {
    if (peers.length !== peerNum) setPeerNum(peers.length)
  }, [peers, peerNum])

  const openMenu = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }
  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap>
            IPFS
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <IconButton>
            <Badge badgeContent={peerNum}>
              <Group />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
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
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        open={!!anchorEl}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            closeMenu()
            ipfs && !ipfs.isOnline() && ipfs.start()
          }}
        >
          Start
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu()
            ipfs && ipfs.isOnline() && ipfs.stop()
          }}
        >
          Stop
        </MenuItem>
      </Menu>
    </div>
  )
}
