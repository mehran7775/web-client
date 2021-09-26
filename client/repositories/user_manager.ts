import { AxiosResponse } from "axios"
import { NuxtAxiosInstance } from "@nuxtjs/axios"
import { User } from "~/types/sso"




async function getUser(userName: string | null, axios: NuxtAxiosInstance) {
  if (userName) {
    const res: AxiosResponse<User> = await axios.get('/sso/user/' + userName)

    try {
      if (res.data) {
        if (typeof res.data.settings === 'string' || res.data.settings instanceof String)
          res.data.settings = JSON.parse(res.data.settings)
        if (typeof res.data.profile === 'string' || res.data.profile instanceof String)
          res.data.profile = JSON.parse(res.data.profile)
      }
    } catch (err: any) {
      console.log(err)
    }
    return res
  } else {
    return await axios.get('/sso/user/')
  }
}

async function getUserList(searchModel: string, axios: NuxtAxiosInstance) {
  return await axios.post('/sso/user/list', searchModel)
}

async function updateUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.put('/sso/user/update', form)
}

async function updateUserWatchlist(watchlist: object, axios: NuxtAxiosInstance) {
  return await axios.put('/sso/user/update-watchlist', watchlist)
}

async function createUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.post('/sso/user/', form)
}

async function deleteUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.delete('/sso/user/delete/' + form)
}

const userRoles: object[] = [
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

export default {
  getUser,
  getUserList,
  createUser,
  deleteUser,
  updateUser,
  updateUserWatchlist,
  userRoles
}
