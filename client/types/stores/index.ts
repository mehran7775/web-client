import { User, AnonymousUser } from '@/types/'

export class RootState {
  locale: string

  constructor() {
    this.locale = process.env.VUE_APP_I18N_LOCALE ?? ''
  }
}

export class UserState {
  token: null
  user: User
  refresh: string | null
  userName: string | null
  constructor() {
    this.token = null
    this.user = AnonymousUser()
    this.refresh = null
    this.userName = null
  }
}
