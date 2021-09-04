import { create, IPFS } from 'ipfs'
import { useEffect, useCallback, useState } from 'react'

export const useLazyIPFS = (args?: Parameters<typeof create>[0]) => {
  const [ipfs, setIPFS] = useState<IPFS | null>(null)
  const createIPFS = useCallback(async () => {
    setIPFS(await create(args))
  }, [args])
  useEffect(() => {
    return () => {
      ipfs?.stop()
    }
  }, [ipfs])
  return [ipfs, createIPFS] as [typeof ipfs, typeof createIPFS]
}

export const useIPFS = (args?: Parameters<typeof create>[0]) => {
  const [ipfs, createIPFS] = useLazyIPFS(args)
  useEffect(() => {
    createIPFS()
  }, [createIPFS])
  return ipfs
}
