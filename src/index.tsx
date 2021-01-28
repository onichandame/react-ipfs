import React, {
  FC,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'
import createHttpClient from 'ipfs-http-client'

type Ipfs = ReturnType<typeof createHttpClient> | null

type ExternalArgs = Parameters<typeof createHttpClient>[0]

const useIpfsPromise = (args: ExternalArgs): Promise<Ipfs> => {
  const [ipfsPromise, setIpfsPromise] = useState<Promise<Ipfs>>(
    Promise.resolve(null)
  )

  useEffect(() => {
    const ipfs = createHttpClient(args)
    setIpfsPromise(Promise.resolve(ipfs))

    return () => setIpfsPromise(Promise.resolve(null))
  }, [args])

  return ipfsPromise
}

const Context = createContext<{ ipfs: Ipfs; error?: Error }>({
  ipfs: null,
})

export const IpfsProvider: FC<{
  livelinessProbe?: boolean
  probeInterval?: number
  opts: Parameters<typeof useIpfsPromise>[0]
}> = ({ children, opts, livelinessProbe, probeInterval }) => {
  const ipfsPromise = useIpfsPromise(opts)
  const [ipfs, setIpfs] = useState<Ipfs>(null)
  const [error, setError] = useState<Error>()
  useEffect(() => {
    ipfsPromise
      .then(ipfs => {
        if (ipfs)
          return ipfs.id().then(() => {
            setIpfs(ipfs)
            setError(undefined)
          })
        else {
          setIpfs(null)
          setError(undefined)
        }
        return
      })
      .catch(e => {
        setIpfs(null)
        setError(e)
      })
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
              .catch(e => {
                setError(e)
              }),
          probeInterval || 5000
        )
      )
    }
    return () => jobs.forEach(job => clearInterval(job))
  }, [ipfs, error])
  return <Context.Provider value={{ ipfs, error }}>{children}</Context.Provider>
}

export const useIpfs = () => {
  const ipfs = useContext(Context)
  return ipfs
}
