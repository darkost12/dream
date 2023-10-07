import { getStyles, generateImage } from 'dream-api'
import { Style, styleFromRaw } from './types/style.js'
import { Pulse, PulseRaw, pulseFromRaw } from './types/pulse.js'
import { Warning } from './types/warning.js'

async function listStyles(): Promise<Array<Style>> {
  const result = await getStyles()

  return result.map(styleFromRaw)
}

type PulseCallback = (pulse: Pulse) => void
async function dream(style: number | undefined, prompt: string, token: string | undefined, callback: PulseCallback): Promise<Pulse | Warning> {
  try {
    const result: PulseRaw = await new Promise(async (resolve, reject) => {
      resolve(
        await generateImage(
          style || 84,
          prompt,
          token,
          undefined,
          undefined,
          undefined,
          undefined,
          raw => {
            if (raw.detail) {
              console.log(raw.detail)
              reject(raw.detail)
            } else {
              callback(pulseFromRaw(raw))
            }
          }
        )
      )
    })

    return pulseFromRaw(result)
  } catch (e: any) {
    return new Warning(e)
  }
}

let Dream = { listStyles, dream }

export default Dream
