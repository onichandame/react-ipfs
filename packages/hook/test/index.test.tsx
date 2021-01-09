import React, { FC, useEffect } from 'react'
import { v4 as randStr } from 'uuid'
import { act, render, screen } from '@testing-library/react'

import { useIpfs, IpfsProvider } from '../src'

describe(`react ipfs hook`, () => {
  test(`can start ipfs node`, done => {
    const unknown = randStr()
    const error = randStr()
    const success = randStr()
    const Child: FC = () => {
      const [ipfs, err] = useIpfs()
      useEffect(() => {
        setTimeout(() => ipfs && ipfs.stop(), 2000)
      }, [])
      return <div>{err ? error : ipfs ? success : unknown}</div>
    }
    const Parent: FC = () => {
      return (
        <IpfsProvider>
          <Child />
        </IpfsProvider>
      )
    }
    act(() => {
      const { unmount } = render(<Parent />)
      setTimeout(() => {
        expect(screen.queryByText(unknown)).toBeNull()
        expect(screen.queryByText(error)).toBeNull()
        expect(screen.queryByText(success)).not.toBeNull()
        unmount()
        done()
      }, 4000)
    })
  }, 6000)
})
