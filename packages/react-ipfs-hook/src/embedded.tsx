import { useState, useEffect } from 'react'
import { create } from 'ipfs'
import { PromiseValue } from 'type-fest'

type Ipfs = PromiseValue<ReturnType<typeof create>>

export const useIpfsEmbedded = (): [Ipfs | null, Error | null] => {
  const [ipfs, setIpfs] = useState<Ipfs | null>(null)
  const [error, setError] = useState<Error | null>(null)

  let lock: Promise<any> | null = null
  useEffect(() => {
    async function startIpfs() {
      if (ipfs) {
        console.log('IPFS already started')
      } else {
        try {
          console.time('IPFS Started')
          setIpfs(await create({ EXPERIMENTAL: { ipnsPubsub: true } }))
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
      lock = null
      if (ipfs && ipfs.stop) {
        console.log('Stopping IPFS')
        ipfs.stop().catch((err: any) => console.error(err))
        setIpfs(null)
        setError(null)
      }
    }
  }, [])

  return [ipfs, error]
}
