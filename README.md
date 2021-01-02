# react-ipfs-hook

Start an embedded IPFS node for React apps.

# Author

[onichandame](https://onichandame.com)

# Usage

For live example check <https://onichandame.com/react-ipfs-hook/>

For detailed usage see [the example](./packages/example).

```typescriptreact
// App.tsx
import {IpfsProvider} from 'react-ipfs-hook'
const App=()=>{
  return <IpfsProvider><Child /></IpfsProvider>
}

// child.tsx
import {useIpfs} from 'react-ipfs-hook'
const Child: FC = () => {
  const { ipfs } = useIpfs()
  const [id, setId] = useState(``)
  useEffect(() => {
    ipfs.id().then(id => setId(id))
  }, [ipfs])
  return (
    <div>{id}</div>
  )
}
```
