import { makeStyles } from '@material-ui/core/styles'
import { SnackbarProvider, useSnackbar } from 'notistack'
import React, {
  MouseEvent,
  useContext,
  createContext,
  FC,
  useEffect,
  useState,
  ContextType,
} from 'react'
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Badge,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
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
import { Meta, Story } from '@storybook/react'

import { useIpfs, IpfsProvider } from '../src'

const randStr = () =>
  Math.random()
    .toString(36)
    .substr(2, 5)

const Id = createContext(``)
const Peers = createContext(
  [] as {
    addr: any
    peer: string
    // only if verbose: true
    latency?: string
    muxer: string
    // only if verbose: true
    streams?: string[]
    direction: number
  }[]
)
const PeerNum = createContext(0)

const Wrapper: FC = ({ children }) => {
  const { ipfs, error } = useIpfs()
  const [id, setId] = useState<ContextType<typeof Id>>(``)
  const [peers, setPeers] = useState<ContextType<typeof Peers>>([])
  const [peerNum, setPeerNum] = useState<ContextType<typeof PeerNum>>(0)
  // update basic info regularly
  useEffect(() => {
    const reset = () => {
      setId(``)
      setPeers([])
    }
    let jobs: ReturnType<typeof setInterval>[] = []
    if (ipfs && ipfs.id) ipfs.id().then(({ id }: { id: string }) => setId(id))
    if (ipfs && ipfs.swarm && ipfs.swarm.peers) {
      jobs.push(
        setInterval(() => {
          ipfs.swarm.peers().then((prs: any[]) => setPeers(prs))
        }, 1000)
      )
    }
    if (!ipfs) reset()
    return () => jobs.forEach(job => clearInterval(job))
  }, [ipfs])
  // update derived info regularly
  useEffect(() => {
    const newPeerNum = peers.length
    if (newPeerNum !== peerNum) setPeerNum(newPeerNum)
  }, [peers, peerNum])
  return (
    <Id.Provider value={id}>
      <Peers.Provider value={peers}>
        <PeerNum.Provider value={peerNum}>
          <SnackbarProvider maxSnack={2}>
            {error ? JSON.stringify(error.stack) : children}
          </SnackbarProvider>
        </PeerNum.Provider>
      </Peers.Provider>
    </Id.Provider>
  )
}

const PeersList: FC = () => {
  const peers = useContext(Peers)
  const { enqueueSnackbar } = useSnackbar()
  return (
    <List>
      {peers.map(peer => (
        <ListItem
          onClick={e => {
            e.preventDefault()
            navigator.clipboard.writeText(peer.peer)
            enqueueSnackbar(`peer id copied!`, { variant: `success` })
          }}
          button
          key={randStr()}
        >
          {peer.peer}
        </ListItem>
      ))}
    </List>
  )
}

const NavBar: FC = () => {
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
            {peerNum <= 0 ? (
              <SignalCellularConnectedNoInternet0Bar />
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

type Props = {
  host: string
  protocol: 'http' | 'https'
  port: number
  livelinessProbe: true
  probeInterval: 5000
}

const Root: FC<Props> = ({
  host,
  protocol,
  port,
  probeInterval,
  livelinessProbe,
}) => {
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }))
  const styles = useStyles()
  return (
    <IpfsProvider
      livelinessProbe={livelinessProbe}
      probeInterval={probeInterval}
      opts={{ protocol, host, port }}
    >
      <Wrapper>
        <div className={styles.root}>
          <NavBar />
        </div>
      </Wrapper>
    </IpfsProvider>
  )
}

export default {
  title: 'IPFS',
  component: Root,
  argTypes: {
    host: {
      control: { type: `text` },
    },
    port: { control: { type: `number`, min: 1 } },
    protocol: { control: { type: `text` } },
    probeInterval: { control: { type: `number` }, defaultValue: 5000 },
    livelinessProbe: { control: { type: `boolean` }, defaultValue: true },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta<Props>

const Template: Story<Props> = args => <Root {...args} />

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Example = Template.bind({})
Example.args = {
  host: `localhost`,
  port: 5001,
  protocol: `http`,
  probeInterval: 5000,
  livelinessProbe: true,
}
