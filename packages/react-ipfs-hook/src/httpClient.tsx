import { useState, useEffect } from 'react'
import Ipfs from 'ipfs-http-client'

export const useIpfsHttpClient = (
  ...opts: ConstructorParameters<typeof Ipfs>
): [Ipfs | null, Error | null] => {
  const [ipfs, setIpfs] = useState<Ipfs | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [lock, setLock] = useState<Promise<any> | null>(null)

  useEffect(() => {
    // The fn to useEffect should not return anything other than a cleanup fn,
    // So it cannot be marked async, which causes it to return a promise,
    // Hence we delegate to a async fn rather than making the param an async fn.
    async function startIpfs() {
      if (ipfs) {
        console.log('IPFS already started')
      } else {
        try {
          if (!opts || !opts[0]) {
            setIpfs(null)
            setError(new Error(`daemon address cannot be empty`))
          } else {
            console.time('IPFS Started')
            setIpfs(new Ipfs(...opts))
            console.timeEnd('IPFS Started')
            setError(null)
          }
        } catch (e) {
          console.error('IPFS init error:', e)
          setIpfs(null)
          setError(e)
        }
      }
    }

    if (!lock) setLock(startIpfs())
    return () => {
      setLock(null)
    }
  }, opts)

  return [ipfs, error]
}
