import axios from 'axios'

//экспортируем переменную окружения $axios
//предварительно добавив ей в заголовок Autorization
//jwt token пользователя из локального хранилища
export default async ({ Vue }) => {
  Vue.prototype.$axios = axios;
    let token = sessionStorage.getItem('token');
    if(token) {
      Vue.prototype.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
}
