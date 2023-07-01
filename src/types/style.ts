export class StyleRaw {
  id: number
  name: string
  is_premium: boolean

  constructor(
    id: number,
    name: string,
    is_premium: boolean
  ) {
    this.id = id
    this.name = name
    this.is_premium = is_premium
  }
}

export class Style {
  id: number
  name: string
  isPremium: boolean

  constructor(
    id: number,
    name: string,
    isPremium: boolean
  ) {
    this.id = id
    this.name = name
    this.isPremium = isPremium
  }

  public fromRaw(raw: StyleRaw): Style {
    return new Style(raw.id, raw.name, raw.is_premium)
  }
}

export const styleFromRaw = Style.prototype.fromRaw

