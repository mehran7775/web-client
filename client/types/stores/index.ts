import { User, AnonymousUser } from '@/types/'

export class RootState {
  locale: string
  editMode: boolean
  menuIndex: number | null

  constructor() {
    this.locale = process.env.VUE_APP_I18N_LOCALE ?? ''
    this.editMode = false
    this.menuIndex = null
  }
  toJSON() {
    return { ...this }
  }
}

export class UserState {
  tryCount: number
  token: null
  user: User
  refresh: string | null
  userName: string | null
  constructor() {
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
