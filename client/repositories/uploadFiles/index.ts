import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'
const instance = axios.create({
    withCredentials: true,
    // baseURL: process.env.VUE_APP_Host,
})

interface uploadFilesservice {
    upload(file: File, onUploadProgress: any): Promise<AxiosResponse> 
}



class UploadFilesService implements uploadFilesservice {
    upload(file: File) {
      let formData = new FormData();
      formData.append("file", file);
      return instance.post(`http://localhost:5000/files/${file.name}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      })
    }
}
export default new UploadFilesService
