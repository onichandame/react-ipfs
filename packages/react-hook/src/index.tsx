import { useReducer, useEffect } from 'react'

export const useCount = () => {
  const [val, update] = useReducer((old) => old + 1, 0)
  useEffect(() => {
    setInterval(update, 1000)
  }, [])
  return { val }
}
