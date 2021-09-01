export type Setting = {
  lang: string,
  columns: Array<string>,
  watch_lists: object,
}

export type UserCredentials = {
  userName: string,
  password: string,
}

export type User = {
  userName: string,
  nikname: string,
  profile: object,
  settings: Setting,
}