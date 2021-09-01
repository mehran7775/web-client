import { NuxtAxiosInstance } from "@nuxtjs/axios"


async function getUser(userName: string | null, axios: NuxtAxiosInstance) {
  if (userName) {
    let user = await axios.get('/sso/user/' + userName)
    console.log(user)
    user.data.settings = JSON.parse(user.data.settings)
    console.log(user)
    return user
  } else {
    return await axios.get('/sso/user/')
  }
}

async function getUserList(searchModel: string, axios: NuxtAxiosInstance) {
  return await axios.post('/sso/user/list', searchModel)
}

async function updateUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.post('/sso/user/update', form)
}

async function createUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.post('/sso/user/', form)
}

async function deleteUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.get('/sso/user/delete/' + form)
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
  userRoles
}
