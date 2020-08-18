import { useEffect, useState } from 'react'
import { Ipfs, create } from 'ipfs'

let ipfs: Ipfs | null
let lock: Promise<any> | null = null

export const useIpfs = () => {
  const [isIpfsReady, setIpfsReady] = useState<boolean>(Boolean(ipfs))
  const [ipfsInitError, setIpfsInitError] = useState<Error | null>(null)

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
          ipfs = await create()
          console.timeEnd('IPFS Started')
        } catch (error) {
          console.error('IPFS init error:', error)
          ipfs = null
          setIpfsInitError(error)
        }
      }

      setIpfsReady(Boolean(ipfs))
    }

    if (!lock) lock = startIpfs()
    return function cleanup() {
      if (ipfs && ipfs.stop) {
        console.log('Stopping IPFS')
        ipfs.stop().catch(err => console.error(err))
        ipfs = null
        setIpfsReady(false)
      }
    }
  }, [])

  return { ipfs, isIpfsReady, ipfsInitError }
}
