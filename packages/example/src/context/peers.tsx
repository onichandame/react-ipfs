import { createContext } from 'react'

type Peer = {
  addr: any
  peer: string
  // only if verbose: true
  latency?: string
  muxer: string
  // only if verbose: true
  streams?: string[]
  direction: number
}

const context = createContext<Peer[]>([])

export { context as Peers }
