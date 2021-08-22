/* eslint-disable object-shorthand */
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import axios from 'axios';


const instance = axios.create({
  withCredentials: true,
  // crossdomain: true,
  baseURL: process.env.VUE_APP_Host
})

async function refreshToken(refresh: string) {
  const res = await instance.post('/sso/refresh', { token: refresh })
  return res
}

async function login(username: string, password: string, axios:  NuxtAxiosInstance, session = null) {
  return await axios.post('/sso/token', {
    username: username,
    password: password,
    session: session
  })
}

export default {
  login,
  refreshToken
}
