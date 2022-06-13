import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.VUE_APP_Host,
})


export default {
    async send_files(url: string, data: any, config: AxiosRequestConfig = {}) {
        return await instance.post(url, data, config)
    }
}