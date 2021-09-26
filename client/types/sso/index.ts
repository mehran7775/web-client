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
  user_name: string,
  nikname: string,
  profile: object,
  settings: Setting,
}

export type WatchlistColumns = {
  text: string,
  value: string,
  align: string | null,
  sortable: boolean | null,
  filterable: boolean | null,
  groupable: boolean | null,
  divider: boolean | null,
  class: string | string[],
  cellClass: string | string[],
  width: string | number | null,
  filter: Function,
  sort: Function
}