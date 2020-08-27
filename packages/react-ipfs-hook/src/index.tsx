import { useIpfsEmbedded } from './embedded'
import { useIpfsHttpClient } from './httpClient'

type ExternalProps = {
  external: true
  opts: Parameters<typeof useIpfsHttpClient>[0]
}
type EmbeddedProps = {
  external?: false
}

type Props = ExternalProps | EmbeddedProps

export const useIpfs = (opts?: Props) => {
  if (opts && opts.external) return useIpfsHttpClient(opts.opts)
  else return useIpfsEmbedded()
}
