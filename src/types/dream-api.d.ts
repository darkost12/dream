declare module 'dream-api' {
  import { StyleRaw } from '../types/style'
  import { Token } from '../types/token'
  import { PulseRaw } from '../types/pulse'

  function getStyles(): Promise<Array<StyleRaw>>
  function signIn(login: string, password: string): Promise<Token>
  function generateImage(style: number, prompt: string, token: option<string>, _, _, _, _, callback: (pulse: PulseRaw) => void): Promise<PulseRaw>
}
