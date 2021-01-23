# react-ipfs-hook

Connect to an external IPFS daemon. The embedded node is too limited to be usable so an external node is a must.

# Author

[onichandame](https://onichandame.com)

# Usage

To install: `yarn add @onichandame/react-ipfs-hook`

For live example check <https://onichandame.com/react-ipfs-hook/>

For detailed usage see [the example](./packages/example).

```typescript
// App.tsx
import { IpfsProvider } from '@onichandame/react-ipfs-hook'
const App = () => {
  return (
    <IpfsProvider>
      <Child />
    </IpfsProvider>
  )
}

// child.tsx
import { useIpfs } from '@onichandame/react-ipfs-hook'
const Child: FC = () => {
  const ipfsPromise = useIpfs()
  const [id, setId] = useState(``)
  useEffect(() => {
    ipfsPromise.then((ipfs) => ipfs.id().then((id) => setId(id.id)))
  }, [ipfsPromise])
  return <div>{id}</div>
}
```
