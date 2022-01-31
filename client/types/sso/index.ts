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
  columns: Array<WatchlistColumns>,
  watch_lists: any,
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

export class WatchlistColumns {
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
export function DefaultCols(): WatchlistColumns[] {
  return [
    new WatchlistColumns("instrument.name", "name", "start"),
    new WatchlistColumns("instrument.tradeCount", "totalTrades"),
    new WatchlistColumns("instrument.tradeVol", "totalShares"),
    new WatchlistColumns("instrument.tradeVal", "totalTradesValue"),
    new WatchlistColumns("instrument.lowest", "lowest"),
    new WatchlistColumns("instrument.highest", "highest"),
    new WatchlistColumns("instrument.yesterdayPrice", "yesterdayPrice"),
    new WatchlistColumns("instrument.opening", "opening"),
    new WatchlistColumns("instrument.last", "last"),
    new WatchlistColumns("instrument.closing", "closing"),
    new WatchlistColumns("instrument.status", "status", 'center', '123px'),
  ]
}