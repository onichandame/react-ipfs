import React, { FC, useCallback, useState, useEffect } from 'react'
import { v1 as uuid } from 'uuid'
import Ipfs from 'ipfs'
import IpfsHttpClient from 'ipfs-http-client'
import {
  Paper,
  Button,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from '@material-ui/core'

type Props = {
  ipfs: Ipfs | IpfsHttpClient | null
}

export const Panel: FC<Props> = ({ ipfs }) => {
  const fieldId = `file-${uuid()}`
  const [id, setId] = useState<string>(``)
  const [addr, setAddr] = useState<string>(``)
  const [peers, setPeers] = useState<number>(0)
  const [files, setFiles] = useState<{ name: string; cid: string }[]>([])
  const [name, setName] = useState<string>(``)
  const [file, setFile] = useState<File | null>(null)
  const updateFiles = useCallback(async () => {
    if (ipfs) {
      const result = []
      for await (const file of ipfs.files.ls(`/`))
        result.push({ name: file.name, cid: file.cid.toString() })
      setFiles(result)
    }
  }, [ipfs])
  useEffect(() => {
    if (ipfs) {
      ipfs.id().then(id => setId(id.id))
      setInterval(async () => {
        setPeers((await ipfs.swarm.peers()).length)
      }, 1000)
      updateFiles()
    }
  }, [ipfs, updateFiles])
  const listFiles = useCallback(async () => {
    if (ipfs && addr) {
      try {
        let result = ``
        for await (const file of ipfs.cat(addr)) {
          result = file.toString()
          break
        }
        alert(result)
        setName(result)
      } catch (e) {
        alert(e.message)
        setName(e.message)
      }
    }
  }, [ipfs, addr])
  return (
    <Grid container direction="column">
      <Grid item>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="node info">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  ID
                </TableCell>
                <TableCell>{id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Peers
                </TableCell>
                <TableCell>{peers}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item>
        <Grid container direction="column">
          <Grid item>
            <form
              noValidate
              autoComplete="off"
              onSubmit={event => {
                event.preventDefault()
                if (ipfs && file)
                  ipfs.files
                    .write(`/${file.name}`, file, { create: true })
                    .then(updateFiles)
              }}
            >
              <input
                id={fieldId}
                style={{ display: 'none' }}
                type="file"
                onChange={e => {
                  e.preventDefault()
                  if (e.currentTarget.files && e.currentTarget.files.length)
                    setFile(e.currentTarget.files[0])
                }}
              />
              <label htmlFor={fieldId}>
                <Button variant="text" component="span">
                  {file?.name || `choose a file`}
                </Button>
              </label>
              <Button type="submit" variant="contained">
                submit
              </Button>
            </form>
          </Grid>
          <Grid item>{JSON.stringify(files)}</Grid>
          <Grid item>
            <form
              onSubmit={e => {
                e.preventDefault()
                if (ipfs && addr) listFiles()
              }}
            >
              <TextField onChange={e => setAddr(e.currentTarget.value)} />
              <Button type="submit">Get File Content</Button>
            </form>
          </Grid>
          <Grid item>
            <div>{name}</div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
