import { createContext } from 'react'

const Peers = createContext(
  [] as {
    addr: any
    peer: string
    // only if verbose: true
    latency?: string
    muxer: string
    // only if verbose: true
    streams?: string[]
    direction: number
  }[]
)

export { Peers }
