import React, { FC } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useIpfs } from 'react-ipfs-hook'

import { Panel } from './panel'

export const Embedded: FC = () => {
  const [ipfs, ipfsErr] = useIpfs()
  return (
    <Grid container spacing={2} direction={'column'} alignItems="center">
      <Grid item>
        <Typography variant="h5">Embedded IPFS Node:</Typography>
      </Grid>
      <Grid item>{ipfsErr ? ipfsErr.message : <Panel ipfs={ipfs} />}</Grid>
    </Grid>
  )
}
