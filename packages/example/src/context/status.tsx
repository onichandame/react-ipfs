import { createContext } from 'react'

type Status = 'ERROR' | 'RUNNING' | 'UNKOWN'

const context = createContext<Status>(`UNKOWN`)

export { context as Status }
