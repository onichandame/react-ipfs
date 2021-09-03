import React, {
  FC,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'
import createHttpClient from 'ipfs-http-client'

import { Nullable } from './types'

type Ipfs = ReturnType<typeof createHttpClient>

type ExternalArgs = Parameters<typeof createHttpClient>[0]

const useIpfsPromise = (args: ExternalArgs): Nullable<Promise<Ipfs>> => {
  const [ipfsPromise, setIpfsPromise] = useState<Nullable<Promise<Ipfs>>>(null)

  useEffect(() => {
    const ipfs = createHttpClient(args)
    setIpfsPromise(Promise.resolve(ipfs))

    return () => setIpfsPromise(null)
  }, [args])

  return ipfsPromise
}

const Context = createContext<{ ipfs: Nullable<Ipfs>; error: Nullable<Error> }>(
  {
    ipfs: null,
    error: null,
  }
)

export const IpfsProvider: FC<{
  livelinessProbe?: boolean
  probeInterval?: number
  opts: Parameters<typeof useIpfsPromise>[0]
}> = ({ children, opts, livelinessProbe, probeInterval }) => {
  const ipfsPromise = useIpfsPromise(opts)
  const [ipfs, setIpfs] = useState<Nullable<Ipfs>>(null)
  const [error, setError] = useState<Nullable<Error>>(null)
  useEffect(() => {
    let isNew = true
    ipfsPromise?.then((ipfs) => {
      if (ipfs && isNew) setIpfs(ipfs)
      setError(undefined)
    })
    ipfsPromise?.catch((e) => {
      setIpfs(null)
      setError(e)
    })
    return () => {
      isNew = false
    }
  }, [ipfsPromise])
  useEffect(() => {
    const jobs: ReturnType<typeof setInterval>[] = []
    if (livelinessProbe) {
      jobs.push(
        setInterval(
          () =>
            ipfs
              ?.id()
              .then(() => {
                if (error) setError(undefined)
              })
              .catch((e) => {
                setError(e)
              }),
          probeInterval || 5000
        )
      )
    }
    return () => jobs.forEach((job) => clearInterval(job))
  }, [ipfs, error])
  return <Context.Provider value={{ ipfs, error }}>{children}</Context.Provider>
}

export const useIpfs = () => {
  const ipfs = useContext(Context)
  return ipfs
}
