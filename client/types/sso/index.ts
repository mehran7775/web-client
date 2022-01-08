export type Log = {
  id: string,
  dateTime: string,
  ip: string,
  type: string
}

export type Setting = {
  lang: string,
  columns: Array<WatchlistColumns>,
  watch_lists: object,
}

export type UserCredentials = {
  userName: string,
  password: string,
}

export class Login {
  userName: string
  password: string
  passwordType: number
  captcha: string
  constructor(userName: string, password: string, captcha: string) {
    this.userName = userName
    this.captcha = captcha
    this.password = password
    this.passwordType = 1
  }
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
  sortable: boolean | null
  filterable: boolean | null
  groupable: boolean | null
  divider: boolean | null
  class: string | string[] | null
  cellClass: string | string[] | null
  width: string | number | null
  filter: Function | null
  sort: Function | null
  constructor(text: string, value: string, align: string = 'center') {
    this.text = text
    this.value = value
    this.align = align
    this.sortable = null
    this.filterable = null
    this.groupable = null
    this.divider = null
    this.class = null
    this.cellClass = null
    this.width = null
    this.filter = null
    this.sort = null
  }
}

export function AnonymousUser(): User {
  return new User(
    'anonymous',
    { nickname: 'Anonymous', profilePic: null },
    { lang: 'fa-IR', columns: [], watch_lists: {} }
  )
}
export function DefaultCols(): WatchlistColumns[] {
  return [
    new WatchlistColumns("instrument.name", "name", "start"),
    new WatchlistColumns("instrument.wealth", "wealth"),
    new WatchlistColumns("instrument.tradeCount", "totalTrades"),
    new WatchlistColumns("instrument.tradeVol", "totalShares"),
    new WatchlistColumns("instrument.tradeVal", "totalTradesValue"),
    new WatchlistColumns("instrument.lowest", "lowest"),
    new WatchlistColumns("instrument.highest", "highest"),
    new WatchlistColumns("instrument.yesterdayPrice", "yesterdayPrice"),
    new WatchlistColumns("instrument.opening", "opening"),
  ]
}