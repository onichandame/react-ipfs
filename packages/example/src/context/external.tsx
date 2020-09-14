import { createContext } from 'react'

const External = createContext<{
  external: boolean
  toggleExternal: () => void
}>({ toggleExternal: () => {}, external: false })

export { External }
