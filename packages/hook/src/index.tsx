import React, {
  FC,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'
import createHttpClient from 'ipfs-http-client'

type Ipfs = Promise<any | null>

type ExternalArgs = Parameters<typeof createHttpClient>[0]

const useIpfsInstance = (args: ExternalArgs): Ipfs => {
  const [ipfs, setIpfs] = useState<Ipfs>(Promise.resolve(null))

  useEffect(() => {
    function clear() {
      const newIpfsPromise = Promise.resolve(null)
      setIpfs(newIpfsPromise)
    }
    setIpfs(Promise.resolve(createHttpClient(args)))

    return clear
  }, [args, args])

  return ipfs
}

const Context = createContext<Ipfs>(Promise.resolve(null))

export const IpfsProvider: FC<Parameters<typeof useIpfsInstance>[0]> = ({
  children,
  ...others
}) => {
  const ipfs = useIpfsInstance(others)
  return <Context.Provider value={ipfs}>{children}</Context.Provider>
}

export const useIpfs = () => {
  const ipfs = useContext(Context)
  return ipfs
}
