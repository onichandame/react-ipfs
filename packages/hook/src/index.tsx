import React, {
  FC,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'
import { create } from 'ipfs'
import createHttpClient from 'ipfs-http-client'

type Ipfs = any

type HookContent = [Ipfs | null, Error | null]

declare global {
  interface Window {
    ipfs?: Ipfs
  }
}

const useEmbeddedIpfs = (...args: Parameters<typeof create>): HookContent => {
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
        console.error('IPFS creation error:', e)
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

export const useExternalIpfs = (
  ...args: Parameters<typeof createHttpClient>
): HookContent => {
  const [ipfs, setIpfs] = useState<Ipfs | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    function clear() {
      setIpfs(null)
      setError(null)
    }
    function init() {
      try {
        const msg = `IPFS HTTP Client Created`
        console.time(msg)
        const client = createHttpClient(...args)
        setIpfs(client)
        console.timeEnd(msg)
        setError(null)
      } catch (e) {
        console.error('IPFS creation error:', e)
        setIpfs(null)
        setError(e)
      }
    }
    clear()
    init()

    return clear
  }, args)

  return [ipfs, error]
}

const Context = createContext<[Ipfs | null, Error | null]>([null, null])

type Props = {
  args?:
    | Parameters<typeof useEmbeddedIpfs>[0]
    | Parameters<typeof useExternalIpfs>[0]
}
export const IpfsProvider: FC<Props> = ({ children, args }) => {
  const [embedded, embeddedErr] = useEmbeddedIpfs(args)
  const [external, externalErr] = useExternalIpfs(args)
  const [content, setContent] = useState<HookContent>([embedded, embeddedErr])
  return <Context.Provider value={content}>{children}</Context.Provider>
}

export const useIpfs = () => {
  const con = useContext(Context)
  return con
}
