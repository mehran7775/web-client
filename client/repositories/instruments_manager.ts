import { NuxtAxiosInstance } from '@nuxtjs/axios';

async function getInstrumentsDetail(instruments:[string,number],axios: NuxtAxiosInstance) {
  return await axios.get('oms/instruments/daily-detail?ids=' + instruments)
}

async function autoComplete(value:string,axios: NuxtAxiosInstance) {
  return await axios.get('oms/instruments/name-autocomplete?name=' + value)
}

export default {
  getInstrumentsDetail,
  autoComplete
}
