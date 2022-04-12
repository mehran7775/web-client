import { AxiosResponse, AxiosInstance } from "axios"
import { User, Setting } from "~/types/sso"


export async function getUser(userName: string | null, axios: AxiosInstance): Promise<AxiosResponse<User>> {
  if (userName) {
    return await axios.get('/sso/user/' + userName)
  } else {
    return await axios.get('/sso/user/')
  }
}

export async function getUserList(searchModel: string, axios: AxiosInstance) {
  return await axios.post('/sso/user/list', searchModel)
}

export async function updateUser(form: object, axios: AxiosInstance) {
  return await axios.put('/sso/user/update', form)
}

export async function updateUserSettings(path: string, settings: any, axios: AxiosInstance):
  Promise<AxiosResponse<{ setting: Setting }>> {
  return await axios.put('/sso/user/edit-setting?keys=' + (path ?? '/'), settings, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function deleteUserSettings(path: string, axios: AxiosInstance):
  Promise<AxiosResponse<{ setting: Setting }>> {
  return await axios.delete('/sso/user/edit-setting?keys=' + (path ?? '/'), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function updateUserWatchlist(watchlist: object, axios: AxiosInstance) {
  return await axios.put('/sso/user/update-watchlist', watchlist)
}

export async function createUser(form: object, axios: AxiosInstance) {
  return await axios.post('/sso/user/', form)
}

export async function deleteUser(form: object, axios: AxiosInstance) {
  return await axios.delete('/sso/user/delete/' + form)
}

export async function getProfileImage(name: string, axios: AxiosInstance) {
  return await axios.get('/sso/user/download-profile-photo?id=' + name)
}

export async function getUserLog(username: string, offset: number, length: number, axios: AxiosInstance) {
  return await axios.get('/sso/user/enter-exit-log?offset=' + (offset ?? 0) + '&length=' + (length ?? 10) + '&user=' + username)
}

export default {
  getUser,
  getUserList,
  updateUser,
  updateUserSettings,
  deleteUserSettings,
  updateUserWatchlist,
  createUser,
  deleteUser,
  getProfileImage,
  getUserLog
}