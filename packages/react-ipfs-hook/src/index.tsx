import React, {
  FC,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'
import { create } from 'ipfs'

type Ipfs = any

declare global {
  interface Window {
    ipfs?: Ipfs
  }
}

const useIpfsHook = (
  ...args: Parameters<typeof create>
): [Ipfs | null, Error | null] => {
  const [ipfs, setIpfs] = useState<Ipfs | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function stopIpfs() {
      setIpfs(null)
      setError(null)
    }
    async function startIpfs() {
      try {
        const msg = `IPFS Created`
        console.time(msg)
        setIpfs(
          window.ipfs ||
            (await create(...args).then(async (ipfs) => {
              window.ipfs = ipfs
              return ipfs
            }))
        )
        console.timeEnd(msg)
        setError(null)
      } catch (e) {
        console.error('IPFS init error:', e)
        setIpfs(null)
        setError(e)
      }
    }
    stopIpfs().then(() => startIpfs())

    return () => {
      stopIpfs()
    }
  }, args)

  return [ipfs, error]
}

const Context = createContext<[Ipfs | null, Error | null]>([null, null])

type Props = {
  args?: Parameters<typeof useIpfsHook>[0]
}
export const IpfsProvider: FC<Props> = ({ children, args }) => {
  const [ipfs, err] = useIpfsHook(args)
  return <Context.Provider value={[ipfs, err]}>{children}</Context.Provider>
}

export const useIpfs = () => {
  const con = useContext(Context)
  return con
}
