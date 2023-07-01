import { getStyles, signIn, generateImage } from 'dream-api'
import { Style, styleFromRaw } from './types/style.js'
import { Pulse, pulseFromRaw } from './types/pulse.js'

async function listStyles(): Promise<Array<Style>> {
  const result = await getStyles()

  return result.map(styleFromRaw)
}

async function login(email: string, pass: string): Promise<string> {
  return await signIn(email, pass)
}

type PulseCallback = (pulse: Pulse) => void
async function dream(style: number | undefined, prompt: string, token: string | undefined, callback: PulseCallback): Promise<Pulse> {
  const pulseRaw =
    await generateImage(
      style || 84,
      prompt,
      token,
      undefined,
      undefined,
      undefined,
      undefined,
      raw => callback(pulseFromRaw(raw))
    )

  return pulseFromRaw(pulseRaw)
}

let Dream = { listStyles, login, dream }

export default Dream
