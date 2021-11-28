import { User, AnonymousUser } from '@/types/'

export class RootState {
  locale: string
  menuIndex: number | null

  constructor() {
    this.locale = process.env.VUE_APP_I18N_LOCALE ?? ''
    this.menuIndex = null
  }
  toJSON() {
    return { ...this }
  }
}

export class UserState {
  lastTry: string
  tryCount: number
  token: null
  user: User
  refresh: string | null
  userName: string | null
  constructor() {
    this.lastTry = '1990-03-01T07:30:00.000'
    this.tryCount = 0
    this.token = null
    this.user = AnonymousUser()
    this.refresh = null
    this.userName = null
  }
  toJSON() {
    return { ...this }
  }
}
