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
  user_name: string,
  nikname: string,
  profile: object,
  settings: Setting,
}