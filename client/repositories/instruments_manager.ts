import { NuxtAxiosInstance } from '@nuxtjs/axios';

async function getInstrumentsDetail(instruments:[string,number],axios: NuxtAxiosInstance) {
  return await (await axios.get('oms/instruments/daily-detail?ids=' + instruments + "&offset=0&length=" + instruments.length)).data
}

async function autoComplete(value:string,axios: NuxtAxiosInstance) {
  return await axios.get('oms/instruments/name-autocomplete?name=' + value)
}

export {
  getInstrumentsDetail,
  autoComplete
}
