import { useState, useEffect } from 'react'
import {} from 'ipfs-http-client'
import Ipfs from 'ipfs'

export const useIpfs = (): [Ipfs | null, Error | null] => {
  const [ipfs, setIpfs] = useState<Ipfs | null>(null)
  const [error, setError] = useState<Error | null>(null)

  let lock: Promise<any>
  useEffect(() => {
    // The fn to useEffect should not return anything other than a cleanup fn,
    // So it cannot be marked async, which causes it to return a promise,
    // Hence we delegate to a async fn rather than making the param an async fn.
    async function startIpfs() {
      if (ipfs) {
        console.log('IPFS already started')
      } else {
        try {
          console.time('IPFS Started')
          setIpfs(await Ipfs.create())
          console.timeEnd('IPFS Started')
          setError(null)
        } catch (e) {
          console.error('IPFS init error:', e)
          setIpfs(null)
          setError(e)
        }
      }
    }

    if (!lock) lock = startIpfs()
    return function cleanup() {
      if (ipfs && ipfs.stop) {
        console.log('Stopping IPFS')
        ipfs.stop().catch(err => console.error(err))
        setIpfs(null)
        setError(null)
      }
    }
  }, [])

  return [ipfs, error]
}
