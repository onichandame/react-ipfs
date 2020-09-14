import React, { FC, useContext } from 'react'
import {
  TextField,
  Switch,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'

import { External, ExternalUrl } from '../context'

export const NavBar: FC = () => {
  const { externalUrl, setExternalUrl } = useContext(ExternalUrl)
  const { external, toggleExternal } = useContext(External)
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap>
          IPFS
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <Typography variant="h6" noWrap>
          {external ? `External` : `Embedded`}
        </Typography>
        <Switch value={external} onChange={toggleExternal} />
        {external && (
          <TextField
            defaultValue={externalUrl}
            onBlur={e => setExternalUrl(e.currentTarget.value)}
          />
        )}
      </Toolbar>
    </AppBar>
  )
}
