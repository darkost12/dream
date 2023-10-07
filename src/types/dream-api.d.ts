declare module 'dream-api' {
  import { StyleRaw } from '../types/style'
  import { Token } from '../types/token'
  import { PulseRaw } from '../types/pulse'
  import { Warning } from '../types/warning'

  function getStyles(): Promise<Array<StyleRaw>>
  function generateImage(style: number, prompt: string, token: option<string>, _, _, _, _, callback: (pulse: PulseRaw) => void): Promise<PulseRaw | Warning>
}
