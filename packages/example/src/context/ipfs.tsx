import { createContext } from 'react'
import { useIpfs } from 'react-ipfs-hook'

type Ipfs = ReturnType<typeof useIpfs>[0]
type IpfsErr = ReturnType<typeof useIpfs>[1]

const Ipfs = createContext<{
  ipfs: Ipfs | null
  ipfsErr: IpfsErr | null
}>({ ipfs: null, ipfsErr: null })

export { Ipfs }
