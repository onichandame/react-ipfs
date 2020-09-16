import React, { FC, useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { v4 as uuid } from 'uuid'

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
  const length = typeof fields === 'number' ? fields : fields.length
  const [val, setVal] = useState<string[]>(() => {
    const initArr = []
    for (let i = 0; i < length; ++i) initArr.push(``)
    return initArr
  })
  const [label] = useState<string>(uuid())
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit(val)
      }}
    >
      {Array.from(new Array(length)).map((_, index) => (
        <TextField
          key={`${label}-${index}`}
          placeholder={Array.isArray(fields) ? fields[index] : ``}
          onChange={e => {
            const newArr = Array.from(val)
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
