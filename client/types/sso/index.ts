export type Setting = {
  lang: string,
  columns: Array<WatchlistColumns>,
  watch_lists: object,
}

export type UserCredentials = {
  userName: string,
  password: string,
}

export type User = {
  userName: string,
  profile: UserProfile,
  settings: Setting,
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
    this.align = null
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

export function DefaultCols(): WatchlistColumns[] {
  return [
    new WatchlistColumns("id", "id")
  ]
}