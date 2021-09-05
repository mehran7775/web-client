import { NuxtAxiosInstance } from '@nuxtjs/axios';

async function getInstrumentsDetail(instruments:[string,number],axios: NuxtAxiosInstance) {
  return await axios.get('instruments/daily-detail?ids=' + instruments)
}

export default {
  getInstrumentsDetail
}
