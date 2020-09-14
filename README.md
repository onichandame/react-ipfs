# react-ipfs-hook

react hook for ipfs

# Author

[onichandame](https://onichandame.com)

# Usage

For live example check <https://onichandame.com/react-ipfs-hook/>

For detailed usage see [the example](./packages/example).

**Embedded node is not a fully-functioning IPFS node yet. it lacks some DHT and pubsub functionalities. It is recommended to use the external mode. Remember to enable experimental features if needed.**

```typescriptreact
import React, { FC, useState, useEffect } from 'react'
import { useIpfs } from `react-ipfs-hook`

// Embedded Node
const Component: FC = () => {
  const { ipfs } = useIpfs()
  const [id, setId] = useState(``)
  useEffect(() => {
    ipfs.id().then(id => setId(id))
  }, [ipfs])
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
  }, [ipfs])
  return (
    <div>{id}</div>
  )
}
```

Note: running an external IPFS daemon is recommended as the in-browser node is still very limited and almost unusable. Check [my blog](https://onichandame.com/post/ipfs) for details.
