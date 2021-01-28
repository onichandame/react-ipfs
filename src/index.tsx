import React, {
  FC,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react'
import createHttpClient from 'ipfs-http-client'

type Ipfs = ReturnType<typeof createHttpClient> | null
type Status = 'ERROR' | 'UNKNOWN' | 'RUNNING'

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

const Context = createContext<{ ipfs: Ipfs; status: Status; error?: Error }>({
  ipfs: null,
  status: `UNKNOWN`,
})

export const IpfsProvider: FC<{
  opts: Parameters<typeof useIpfsPromise>[0]
}> = ({ children, opts }) => {
  const ipfsPromise = useIpfsPromise(opts)
  const [status, setStatus] = useState<Status>(`UNKNOWN`)
  const [ipfs, setIpfs] = useState<Ipfs>(null)
  const [error, setError] = useState<Error>()
  useEffect(() => {
    ipfsPromise
      .then(ipfs => {
        if (ipfs)
          return ipfs.id().then(() => {
            if (status !== `RUNNING`) setStatus(`RUNNING`)
            setIpfs(ipfs)
            setError(undefined)
          })
        else {
          setError(undefined)
          return status !== `UNKNOWN` && setStatus(`UNKNOWN`)
        }
      })
      .catch(e => {
        if (status !== `ERROR`) setStatus(`ERROR`)
        setError(e)
      })
  }, [ipfsPromise, status])
  return (
    <Context.Provider value={{ ipfs, status, error }}>
      {children}
    </Context.Provider>
  )
}

export const useIpfs = () => {
  const ipfs = useContext(Context)
  return ipfs
}
