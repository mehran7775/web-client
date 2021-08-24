/* eslint-disable object-shorthand */
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import axios from 'axios';


const instance = axios.create({
  withCredentials: true,
  // crossdomain: true,
  baseURL: process.env.VUE_APP_Host
})

async function refreshToken(refresh: string) {
  const res = await instance.put('/jwt', { refresh: refresh })
  return res
}

async function login(username: string, password: string, axios:  NuxtAxiosInstance, session = null) {
  return await instance.post('/jwt', {
    username: username,
    password: password,
    session: session
  })
}

export default {
  login,
  refreshToken
}
