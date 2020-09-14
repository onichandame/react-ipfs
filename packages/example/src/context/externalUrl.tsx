import { createContext } from 'react'

const ExternalUrl = createContext<{
  externalUrl: string
  setExternalUrl: (val: string) => void
}>({ setExternalUrl: () => {}, externalUrl: `http://localhost:5001` })

export { ExternalUrl }
