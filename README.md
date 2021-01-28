# react-ipfs-hook

Connect to an external IPFS daemon. The embedded node is too limited to be usable so an external node is a must.

A recommended setup is to run a go-ipfs node locally and use this library to connect to the local node, but any node can be accessed if it provides an accessible gateway.

_note: In most use cases the node and the webpage in which this lib runs are from different origins. The CORS protection of the node must be turned off._

# Author

[onichandame](https://onichandame.com)

# Usage

The designed use case is to wrap the entire app with a context provider providing the ipfs instance to every component inside. **The useIpfs hook must be called from the components already wrapped inside the IpfsProvider component.**

To install: `yarn add @onichandame/react-ipfs-hook`

For example usage see [the storybook](https://onichandame.com/react-ipfs-hook), or the [source](./stories/index.stories.tsx).

```typescript
// App.tsx
import { IpfsProvider } from '@onichandame/react-ipfs-hook'
const App = () => {
  return (
    <IpfsProvider
      opts={{ host: `localhost`, port: 5001, protocol: `http` }}
      livelinessProbe={true}
      probeInterval={5000}
    >
      <Child />
    </IpfsProvider>
  )
}

// child.tsx
import { useIpfs } from '@onichandame/react-ipfs-hook'
export const Child: FC = () => {
  const { ipfs, error } = useIpfs()
  const [id, setId] = useState(``)
  useEffect(() => {
    if (ipfs && ipfs.id) ipfs.id().then(val => setId(val.id))
  }, [ipfs])
  return <div>{error ? `node not accessible` : id}</div>
}
```
