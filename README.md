# react-ipfs-hook

react hook for ipfs

# Author

[onichandame](https://onichandame.com)

# Usage

```typescriptreact
import React, { FC, useState, useEffect } from 'react'
import { useIpfs } from `react-ipfs-hook`

const Component: FC = () => {
  const { ipfs } = useIpfs()
  const [id, setId] = useState(``)
  useEffect(() => {
    ipfs.id().then(id => setId(id))
  })
  return (
    <div>{JSON.stringify(id)}</div>
  )
}
```
