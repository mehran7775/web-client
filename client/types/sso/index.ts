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
  captcha: string
  constructor(userName: string, password: string, captcha: string) {
    this.userName = userName
    this.captcha = captcha
    this.password = password
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
  constructor(text: string, value: string) {
    this.text = text
    this.value = value
    this.align = 'center'
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
    new WatchlistColumns("wealth", "wealth"),
    new WatchlistColumns("tradeCount", "totalTrades"),
    new WatchlistColumns("tradeVol", "totalShares"),
    new WatchlistColumns("tradeVal", "totalTradesValue"),
    new WatchlistColumns("lowest", "lowest"),
    new WatchlistColumns("highest", "highest"),
    new WatchlistColumns("yesterdayPrice", "yesterdayPrice"),
    new WatchlistColumns("opening", "opening")
  ]
}