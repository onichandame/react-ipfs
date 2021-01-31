import { List, ListItem } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { FC, useContext } from 'react'

import { randStr } from '../../utils'
import { Peers } from '../../contexts'

export const PeersList: FC = () => {
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
