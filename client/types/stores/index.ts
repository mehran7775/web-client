import { User, AnonymousUser } from '@/types/'
import { ICookie } from "cookie-universal"

export class RootState {
  locale: string
  cookie: ICookie | null

  constructor() {
    this.locale = process.env.VUE_APP_I18N_LOCALE ?? ''
    this.cookie = null
  }
  toJSON() {
    return { ...this }
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
  toJSON() {
    return { ...this }
  }
}
