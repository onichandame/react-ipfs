import { useEffect, useState, FC } from 'react'
import { Meta, Story } from '@storybook/react'

import { useLazyIPFS } from './ipfs'

const Root: FC = () => {
  const [ipfs, createIPFS] = useLazyIPFS()
  const [id, setID] = useState(``)
  useEffect(() => {
    let active = true
    ipfs?.id().then(id => {
      if (active) setID(id.id)
    })
    return () => {
      active = false
    }
  }, [ipfs])
  return (
    <div>
      <div>{id}</div>
      <button onClick={createIPFS}>start node</button>
    </div>
  )
}

export default { title: `Hooks/IPFS/Lazy Hook`, component: Root } as Meta
const Template: Story = () => <Root />
export const Hook = Template.bind({})
