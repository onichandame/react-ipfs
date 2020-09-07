import React, { FC, useState } from 'react'
import { TextField, Button } from '@material-ui/core'

type Props = {
  onSubmit: (val: string[]) => void
  submit?: string
  fields?: string[] | number
}

export const Input: FC<Props> = ({
  fields = 1,
  onSubmit,
  submit = `submit`,
}) => {
  const [val, setVal] = useState<string[]>(() => {
    const initArr = []
    let max = 0
    if (typeof fields === 'number') max = fields
    else max = fields.length
    for (let i = 0; i < max; ++i) initArr.push(``)
    return initArr
  })
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit(val)
      }}
    >
      {val.map((_, index, arr) => (
        <TextField
          label={Array.isArray(fields) ? fields[index] : ``}
          onChange={e => {
            const newArr = Array.from(arr)
            newArr[index] = e.currentTarget.value
            setVal(newArr)
          }}
        />
      ))}
      <Button type="submit" variant="contained">
        {submit}
      </Button>
    </form>
  )
}
