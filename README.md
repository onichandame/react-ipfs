# react-ipfs-hook

react hook for ipfs

# Author

[onichandame](https://onichandame.com)

# Usage

```typescriptreact
import React, { FC } from 'react'
import { useIpfs } from `react-ipfs-hook`

const Component: FC = () => {
  const { ipfs } = useIpfs()
  return (
    <div>{JSON.stringify(ipfs.getDatabases)}</div>
  )
}
```
