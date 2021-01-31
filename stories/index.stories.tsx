import React, { FC } from 'react'
import { Meta, Story } from '@storybook/react'

import { Layout } from './components'

type Props = {
  url: string
  livelinessProbe: true
  probeInterval: 5000
}

const Root: FC<Props> = ({ url, probeInterval, livelinessProbe }) => {
  return (
    <Layout
      ipfsProps={{ probeInterval, livelinessProbe, opts: { url } }}
    ></Layout>
  )
}

export default {
  title: 'IPFS',
  component: Root,
  argTypes: {
    url: {
      control: { type: `text` },
    },
    probeInterval: { control: { type: `number` }, defaultValue: 5000 },
    livelinessProbe: { control: { type: `boolean` }, defaultValue: true },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta<Props>

const Template: Story<Props> = args => <Root {...args} />

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Example = Template.bind({})
Example.args = {
  url: `http://localhost:5001`,
  probeInterval: 5000,
  livelinessProbe: true,
}
