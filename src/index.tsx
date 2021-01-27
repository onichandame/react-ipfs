import React, {
  FC,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'
import createHttpClient from 'ipfs-http-client'

type Ipfs = Promise<ReturnType<typeof createHttpClient> | null>

type ExternalArgs = Parameters<typeof createHttpClient>[0]

const useIpfsInstance = (args: ExternalArgs): Ipfs => {
  const [ipfs, setIpfs] = useState<Ipfs>(Promise.resolve(null))

  useEffect(() => {
    const ipfs = createHttpClient(args)
    setIpfs(Promise.resolve(ipfs))

    return () => setIpfs(Promise.resolve(null))
  }, [args])

  return ipfs
}

const Context = createContext<Ipfs>(Promise.resolve(null))

export const IpfsProvider: FC<{
  opts: Parameters<typeof useIpfsInstance>[0]
}> = ({ children, opts }) => {
  const ipfs = useIpfsInstance(opts)
  return <Context.Provider value={ipfs}>{children}</Context.Provider>
}

export const useIpfs = () => {
  const ipfs = useContext(Context)
  return ipfs
}
