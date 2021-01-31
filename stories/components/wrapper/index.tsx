import React, { FC, ComponentProps } from 'react'
import { SnackbarProvider } from 'notistack'

import { IpfsWrapper } from './ipfs'

export const Wrapper: FC<{ ipfsProps: ComponentProps<typeof IpfsWrapper> }> = ({
  children,
  ipfsProps,
}) => (
  <SnackbarProvider maxSnack={3}>
    <IpfsWrapper {...ipfsProps}>{children}</IpfsWrapper>
  </SnackbarProvider>
)
