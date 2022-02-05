import { User, AnonymousUser } from '@/types/'
import { reactive } from "@nuxtjs/composition-api"
import { KeyValuePairs } from '../collection'

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
  tryCount: number
  token: null
  user: User
  refresh: string | null
  userName: string | null
  renewToken: boolean
  settingsChanged: Array<KeyValuePairs<string, any>>
  constructor() {
    this.tryCount = 0
    this.token = null
    this.user = AnonymousUser()
    this.refresh = null
    this.userName = null
    this.renewToken = false
    this.settingsChanged = reactive([])
  }
  toJSON() {
    return { ...this }
  }
}
