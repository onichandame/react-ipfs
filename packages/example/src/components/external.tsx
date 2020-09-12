import React, { FC, useState } from 'react'
import { Grid, Typography, TextField } from '@material-ui/core'
import { useIpfs } from 'react-ipfs-hook'

import { Panel } from './panel'

export const External: FC = () => {
  const [addr, setAddr] = useState<string>(`http://localhost:5001`)
  const [ipfs, ipfsErr] = useIpfs({ external: true, opts: addr })
  return (
    <Grid container spacing={2} direction={'column'} alignItems="center">
      <Grid item>
        <Grid container direction="row">
          <Grid item>
            <Typography variant="h5">
              <a href="https://onichandame.com/post/ipfs">
                External IPFS Node:
              </a>
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              defaultValue={addr}
              onBlur={e => {
                if (e.currentTarget && e.currentTarget.value)
                  setAddr(e.currentTarget.value)
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>{(ipfsErr && ipfsErr.message) || <Panel ipfs={ipfs} />}</Grid>
    </Grid>
  )
}
