import { useCallback, useState, useEffect } from 'react'
import { create, IPFSHTTPClient } from 'ipfs-http-client'

export const useLazyIPFSHTTPClient = (args?: Parameters<typeof create>[0]) => {
  const [client, setClient] = useState<IPFSHTTPClient | null>(null)
  const createClient = useCallback(async () => {
    setClient(create(args))
  }, [args])
  return [client, createClient] as [typeof client, typeof createClient]
}

export const useIPFSHTTPClient = (args?: Parameters<typeof create>[0]) => {
  const [client, createClient] = useLazyIPFSHTTPClient(args)
  useEffect(() => {
    createClient()
  }, [createClient])
  return client
}
