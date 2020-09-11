import React, { FC, useCallback, useState, useEffect } from 'react'
import { v1 as uuid } from 'uuid'
import { useIpfs } from 'react-ipfs-hook'
import { useSnackbar } from 'notistack'
import {
  Dialog,
  DialogContent,
  Paper,
  Button,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core'

import { Input } from './common'

type Ipfs = ReturnType<typeof useIpfs>[0]

type Props = {
  ipfs: Ipfs | null
}

export const Panel: FC<Props> = ({ ipfs }) => {
  const { enqueueSnackbar } = useSnackbar()
  const fieldId = `file-${uuid()}`
  const [id, setId] = useState<string>(``)
  const [peers, setPeers] = useState<number>(0)
  const [files, setFiles] = useState<{ name: string; cid: string }[]>([])
  const [content, setContent] = useState<string>(``)
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState<boolean>(false)
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
      ipfs.id().then((id: any) => setId(id.id))
      setInterval(async () => {
        setPeers((await ipfs.swarm.peers()).length)
      }, 1000)
      updateFiles()
    }
  }, [ipfs, updateFiles])
  const readFile = useCallback(
    async (addr: string) => {
      if (ipfs && addr) {
        try {
          let result = ``
          for await (const file of ipfs.cat(addr)) {
            result = file.toString()
            break // Read only one file
          }
          setContent(result)
        } catch (e) {
          setContent(e.message)
        }
        setOpen(true)
      }
    },
    [ipfs]
  )
  return (
    <>
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
                <TableRow>
                  <TableCell component="th" scope="row">
                    Publish
                  </TableCell>
                  <TableCell>
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
                          if (
                            e.currentTarget.files &&
                            e.currentTarget.files.length
                          )
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
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Read
                  </TableCell>
                  <TableCell>
                    <Input onSubmit={val => readFile(val[0])} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Subscribe
                  </TableCell>
                  <TableCell>
                    <Input
                      fields={[`topic`]}
                      submit="subscribe"
                      onSubmit={async val => {
                        if (ipfs) {
                          await ipfs?.pubsub.subscribe(val, function (
                            msg: any
                          ) {
                            enqueueSnackbar(
                              `received message ${msg.data.toString()}`
                            )
                          })
                          enqueueSnackbar(`subscribed to ${val}`)
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Publish
                  </TableCell>
                  <TableCell>
                    <Input
                      submit="publish"
                      fields={[`topic`, `message`]}
                      onSubmit={async val => {
                        if (ipfs) {
                          await ipfs.pubsub.publish(val[0], val[1])
                          enqueueSnackbar(
                            `published ${val[1]} to topic ${val[0]}`
                          )
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Files
                  </TableCell>
                  <TableCell>
                    <TableContainer>
                      <TableBody>
                        {files.map(file => (
                          <TableRow>
                            <TableCell>{file.name}</TableCell>
                            <TableCell>{file.cid}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </TableContainer>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>{content}</DialogContent>
      </Dialog>
    </>
  )
}
