import React, { FC, useCallback, useState, useEffect } from 'react'
import { useIpfs } from 'react-ipfs-hook'

export const Fs: FC = () => {
  const [id, setId] = useState<string>(``)
  const [addr, setAddr] = useState<string>(``)
  const [peers, setPeers] = useState<number>(0)
  const [files, setFiles] = useState<{ name: string; cid: string }[]>([])
  const [name, setName] = useState<string>(``)
  const [file, setFile] = useState<File | null>(null)
  const [ipfs, error] = useIpfs()
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
  }, [ipfs, error, updateFiles])
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
    <>
      <div>{`id: ${id}`}</div>
      <div>{`peers: ${peers}`}</div>
      <form
        onSubmit={event => {
          event.preventDefault()
          if (ipfs && file)
            ipfs.files
              .write(`/${file.name}`, file, { create: true })
              .then(updateFiles)
        }}
      >
        <input
          type="file"
          onChange={e => {
            if (e.currentTarget.files && e.currentTarget.files.length)
              setFile(e.currentTarget.files[0])
          }}
        />
        <button type="submit">submit</button>
      </form>
      <div>{JSON.stringify(files)}</div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (ipfs && addr) listFiles()
        }}
      >
        <input type="text" onChange={e => setAddr(e.currentTarget.value)} />
        <button>get file content</button>
      </form>
      <div>{name}</div>
    </>
  )
}
