import { NuxtAxiosInstance } from '@nuxtjs/axios';

async function getMessage(id: number, axios: NuxtAxiosInstance) {
  return await axios.get("http://127.0.0.1:4010/oms/message/" + id).then((response) => response)
}



export default {
    getMessage,
}
