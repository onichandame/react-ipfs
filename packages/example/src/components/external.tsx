import React, { FC, useState } from 'react'
import { Grid, Typography, TextField } from '@material-ui/core'
import { useIpfsHttpClient } from 'react-ipfs-hook'

import { Panel } from './panel'

export const External: FC = () => {
  const [addr, setAddr] = useState<string>(``)
  const [ipfs, ipfsErr] = useIpfsHttpClient(addr)
  return (
    <Grid container spacing={2} direction={'column'}>
      <Grid item>
        <Grid container direction="row">
          <Grid item>
            <Typography variant="h5">External IPFS Node:</Typography>
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
      <Grid item>{ipfsErr ? ipfsErr.message : <Panel ipfs={ipfs} />}</Grid>
    </Grid>
  )
}
