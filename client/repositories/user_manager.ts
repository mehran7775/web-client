import { NuxtAxiosInstance } from "@nuxtjs/axios"


async function getUser(userName: string | null, axios: NuxtAxiosInstance) {
  if (userName) {
    let user = await axios.get('/sso/user/' + userName)
    try {

      if (typeof user.data.settings === 'string' || user.data.settings instanceof String)
        user.data.settings = JSON.parse(user.data.settings)
      if (typeof user.data.profile === 'string' || user.data.profile instanceof String)
        user.data.profile = JSON.parse(user.data.profile)
    } catch (err: any) {
      console.log(err)
    }
    return user
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
