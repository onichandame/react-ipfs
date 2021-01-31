import React, {
  useEffect,
  useState,
  ContextType,
  FC,
  ComponentProps,
} from 'react'

import { useIpfs, IpfsProvider } from '../../../src'
import { Id, Peers, PeerNum } from '../../contexts'

const IpfsInfoWrapper: FC = ({ children }) => {
  const { ipfs, error } = useIpfs()
  const [id, setId] = useState<ContextType<typeof Id>>(``)
  const [peers, setPeers] = useState<ContextType<typeof Peers>>([])
  const [peerNum, setPeerNum] = useState<ContextType<typeof PeerNum>>(0)
  // update basic info regularly
  useEffect(() => {
    const reset = () => {
      setId(``)
      setPeers([])
    }
    let jobs: ReturnType<typeof setInterval>[] = []
    if (ipfs && ipfs.id) ipfs.id().then(({ id }: { id: string }) => setId(id))
    if (ipfs && ipfs.swarm && ipfs.swarm.peers) {
      jobs.push(
        setInterval(() => {
          ipfs.swarm.peers().then((prs: any[]) => setPeers(prs))
        }, 1000)
      )
    }
    if (!ipfs) reset()
    return () => jobs.forEach(job => clearInterval(job))
  }, [ipfs])
  // update derived info regularly
  useEffect(() => {
    const newPeerNum = peers.length
    if (newPeerNum !== peerNum) setPeerNum(newPeerNum)
  }, [peers, peerNum])
  return (
    <Id.Provider value={id}>
      <Peers.Provider value={peers}>
        <PeerNum.Provider value={peerNum}>
          {error ? JSON.stringify(error.stack) : children}
        </PeerNum.Provider>
      </Peers.Provider>
    </Id.Provider>
  )
}

export const IpfsWrapper: FC<ComponentProps<typeof IpfsProvider>> = ({
  children,
  ...other
}) => (
  <IpfsProvider {...other}>
    <IpfsInfoWrapper>{children}</IpfsInfoWrapper>
  </IpfsProvider>
)
