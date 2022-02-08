/* eslint-disable object-shorthand */
import axios, { AxiosInstance } from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: process.env.VUE_APP_Host
})

export async function refreshToken(refresh: string) {
  const res = await instance.put('/sso/jwt', { refresh: refresh })
  return res
}

export async function logout(axios: AxiosInstance) {
  await axios.delete('/sso/jwt')
}

export type dict = { [key: string]: string | number | dict }

export async function login(username: string, password: string, captcha: string, session: dict = {}) {
  return await instance.post('/sso/jwt', {
    username: username,
    password: password,
    captcha: captcha,
    session: session
  })
}

export default {
  refreshToken,
  logout,
  login
}

