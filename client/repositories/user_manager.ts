import { NuxtAxiosInstance } from "@nuxtjs/axios"

async function getUser(userName: string | null, axios: NuxtAxiosInstance) {
  if (userName) {
    return await axios.get('user/' + userName)
  } else {
    return await axios.get('user/')
  }
}

async function getUserList(searchModel: string, axios: NuxtAxiosInstance) {
  return await axios.post('user/list', searchModel)
}

async function updateUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.post('user/update', form)
}

async function createUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.post('user/', form)
}

async function deleteUser(form: object, axios: NuxtAxiosInstance) {
  return await axios.get('user/delete/' + form)
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
