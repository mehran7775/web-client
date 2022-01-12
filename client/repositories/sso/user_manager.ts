import { AxiosResponse } from "axios"
import { NuxtAxiosInstance } from "@nuxtjs/axios"
import { User } from "~/types/sso"
import { Settings } from "luxon"




export async function getUser(userName: string | null, axios: NuxtAxiosInstance): Promise<AxiosResponse<User>> {
  if (userName) {
    return await axios.get('/sso/user/' + userName)
  } else {
    return await axios.get('/sso/user/')
  }
}

export async function getUserList(searchModel: string, axios: NuxtAxiosInstance) {
  return await axios.post('/sso/user/list', searchModel)
}

export async function updateUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.put('/sso/user/update', form)
}

export async function updateUserSettings(settings: Settings, axios: NuxtAxiosInstance) {
  return await axios.put('/sso/user/edit-setting', settings)
}

export async function updateUserWatchlist(watchlist: object, axios: NuxtAxiosInstance) {
  return await axios.put('/sso/user/update-watchlist', watchlist)
}

export async function createUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.post('/sso/user/', form)
}

export async function deleteUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.delete('/sso/user/delete/' + form)
}

export async function getProfileImage(name: string, axios: NuxtAxiosInstance) {
  return await axios.get('/sso/user/download-profile-photo?id=' + name)
}

export async function getUserLog(username: string, offset: number, length: number, axios: NuxtAxiosInstance) {
  return await axios.get('/sso/user/enter-exit-log?offset=' + (offset ?? 0) + '&length=' + (length ?? 10) + '&user=' + username)
}

export function UserRoles(): object[] {
  return [
    {
      value: 'ADMIN',
      text: 'user.roles.ADMIN'
    },
    {
      value: 'OPERATOR',
      text: 'user.roles.OPERATOR'
    },
    {
      value: 'REPORTER',
      text: 'user.roles.REPORTER'
    }
  ]
}