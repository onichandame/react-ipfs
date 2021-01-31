import React, { FC, ComponentProps } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Wrapper } from './wrapper'
import { NavBar } from './navbar'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

export const Layout: FC<ComponentProps<typeof Wrapper>> = ({
  children,
  ipfsProps,
}) => {
  const styles = useStyles()
  return (
    <Wrapper ipfsProps={ipfsProps}>
      <div className={styles.root}>
        <NavBar />
        {children}
      </div>
    </Wrapper>
  )
}
