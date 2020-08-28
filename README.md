# react-ipfs-hook

react hook for ipfs

# Author

[onichandame](https://onichandame.com)

# Usage

For live example check <https://onichandame.com/react-ipfs-hook/>

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

Note: running an external IPFS daemon is recommended as the in-browser solution is still very limited and almost unusable. Check [my guide](https://onichandame.com/post/ipfs) for details.
