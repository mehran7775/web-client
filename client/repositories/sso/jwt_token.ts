/* eslint-disable object-shorthand */
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import axios from 'axios';


const instance = axios.create({
  withCredentials: true,
  baseURL: process.env.VUE_APP_Host
})

export async function refreshToken(refresh: string) {
  const res = await instance.put('/sso/jwt', { refresh: refresh })
  return res
}

export async function logout(axios: NuxtAxiosInstance) {
  await axios.delete('/sso/jwt')
}

export async function login(username: string, password: string, captcha: string, axios: NuxtAxiosInstance, session = null) {
  return await instance.post('/sso/jwt', {
    username: username,
    password: password,
    captcha: captcha,
    session: session
  })
}
