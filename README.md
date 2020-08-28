# react-ipfs-hook

react hook for ipfs

# Author

[onichandame](https://onichandame.com)

# Usage

For detailed usage see [the exampl](./packages/example).

```typescriptreact
import React, { FC, useState, useEffect } from 'react'
import { useIpfs } from `react-ipfs-hook`

// Embedded Node
const Component: FC = () => {
  const { ipfs } = useIpfs()
  const [id, setId] = useState(``)
  useEffect(() => {
    ipfs.id().then(id => setId(id))
  })
  return (
    <div>{id}</div>
  )
}

// External Node(Access through REST API)
const Component: FC = () => {
  const { ipfs } = useIpfs({
    external:true,
    opts: {
      host: `localhost`, port: '5001', protocol: 'http'
    }
  })
  const [id, setId] = useState(``)
  useEffect(() => {
    ipfs.id().then(id => setId(id))
  })
  return (
    <div>{id}</div>
  )
}
```
