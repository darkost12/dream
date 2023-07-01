class GenerationResult {
  final: string

  constructor(final: string) {
    this.final = final
  }
}

class InputSpec {
  style: number
  prompt: string

  constructor(style: number, prompt: string) {
    this.style = style
    this.prompt = prompt
  }
}

export class PulseRaw {
  photo_url_list: Array<string>
  input_spec: InputSpec
  state: string
  result?: GenerationResult

  constructor(
    photo_url_list: Array<string>,
    input_spec: InputSpec,
    state: string,
    result?: GenerationResult
  ) {
    this.photo_url_list = photo_url_list
    this.input_spec = input_spec
    this.state = state
    this.result = result
  }
}

export class Pulse {
  photoUrlList: Array<string>
  inputSpec: InputSpec
  state: string
  result?: GenerationResult

  constructor(
    photoUrlList: Array<string>,
    inputSpec: InputSpec,
    state: string,
    result?: GenerationResult
  ) {
    this.photoUrlList = photoUrlList
    this.inputSpec = inputSpec
    this.state = state
    this.result = result
  }


  public fromRaw(raw: PulseRaw): Pulse {
    return new Pulse(raw.photo_url_list, raw.input_spec, raw.state, raw.result)
  }
}

export const pulseFromRaw = Pulse.prototype.fromRaw
