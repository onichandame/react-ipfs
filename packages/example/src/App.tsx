import React from 'react'
import { Grid, Divider } from '@material-ui/core'

import { Embedded, External } from './components'

function App() {
  return (
    <div className="App">
      <Grid container direction="row" justify="center">
        <Grid item xs={10} md={5}>
          <Embedded />
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item xs={10} md={5}>
          <External />
        </Grid>
      </Grid>
    </div>
  )
}

export default App
