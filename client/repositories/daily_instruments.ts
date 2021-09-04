import axios from 'axios';
const instance = axios.create({
  withCredentials: true,
  // crossdomain: true,
  baseURL: process.env.VUE_APP_Host,
  headers: {
    authorization: sessionStorage.getItem('jwtKey')
  }
})


async function getInstrumentsDetail(instruments:[string,number]) {
  console.log(instruments)
  return await instance.get('instruments/daily-detail?ids=' + instruments)
}

export default {
  getInstrumentsDetail
}
