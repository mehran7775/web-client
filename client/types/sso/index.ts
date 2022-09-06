import { Bookmark } from ".."

export enum PasswordType {
  static = 1,
  smsOtp = 2,
  totp = 3
}

export type LoginModel = {
  userName: string,
  password: string,
  passwordType: PasswordType
  captcha: string
}

export type Log = {
  id: string,
  dateTime: string,
  ip: string,
  type: string
}

export type Setting = {
  lang: string,
  columns: Array<WatchListColumns>,
  watch_lists: { [key: string]: Array<string> },
  home: string,
  bookmarks: Array<Bookmark>,
  shourtcuts: Array<Bookmark>
}

export type UserCredentials = {
  userName: string,
  password: string,
}


export class User {
  userName: string
  profile: UserProfile
  settings: Setting
  constructor(username: string, profile: UserProfile, settings: Setting) {
    this.profile = profile
    this.settings = settings
    this.userName = username
  }
}

export type UserProfile = {
  nickname: string,
  profilePic: string | null
}

export class WatchListColumns {
  text: string
  value: string
  align: string | null
  sortable?: boolean | null
  filterable?: boolean | null
  groupable?: boolean | null
  divider?: boolean | null
  class?: string | string[] | null
  cellClass?: string | string[] | null
  width?: string | number | null
  filter?: Function | null
  sort?: Function | null
  icon?: string | null
  draggable: boolean
  constructor(text: string, value: string, align: string = 'center', width: string | null = null) {
    this.text = text
    this.value = value
    this.align = align
    this.draggable = true
    this.divider = true
    if (width)
      this.width = width
  }
}

export function AnonymousUser(): User {
  return new User(
    'anonymous',
    { nickname: 'Anonymous', profilePic: null },
    { lang: 'fa-IR', columns: [], watch_lists: {}, home: '/', bookmarks: [], shourtcuts: [] }
  )
}
export function DefaultCols(): WatchListColumns[] {
  return [
    new WatchListColumns("instrument.name", "name", "start"),
    new WatchListColumns("instrument.tradeCount", "totalTrades"),
    new WatchListColumns("instrument.tradeVol", "totalShares"),
    new WatchListColumns("instrument.tradeVal", "totalTradesValue"),
    new WatchListColumns("instrument.lowest", "lowest"),
    new WatchListColumns("instrument.highest", "highest"),
    new WatchListColumns("instrument.yesterdayPrice", "yesterdayPrice"),
    new WatchListColumns("instrument.opening", "opening"),
    new WatchListColumns("instrument.last", "last"),
    new WatchListColumns("instrument.closing", "closing"),
  ]
}