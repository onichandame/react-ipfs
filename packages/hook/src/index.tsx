import React, {
  FC,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'
import { create as createIpfs } from 'ipfs'
import createHttpClient from 'ipfs-http-client'

type Ipfs = Promise<any | null>

type EmbeddedArgs = Parameters<typeof createIpfs>[0]
type ExternalArgs = Parameters<typeof createHttpClient>[0]

const useIpfsInstance = (
  args:
    | { mode: 'embedded'; args: EmbeddedArgs }
    | { mode: 'external'; args: ExternalArgs }
): Ipfs => {
  const [ipfs, setIpfs] = useState<Ipfs>(Promise.resolve(null))

  useEffect(() => {
    function clear() {
      const newIpfsPromise = Promise.resolve(null)
      setIpfs(newIpfsPromise)
    }
    switch (args.mode) {
      case `external`:
        setIpfs(Promise.resolve(createHttpClient(args.args)))
        break
      case `embedded`:
        setIpfs(createIpfs(args.args))
        break
      default:
        throw new Error(`mode ${(args as any).mode} not supported!`)
    }

    return clear
  }, [args, args.mode, args.args])

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
