import axios from 'axios'

//экспортируем переменную окружения $axios
//предварительно добавив ей в заголовок Autorization
//jwt token пользователя из локального хранилища
export default async ({ Vue }) => {
  Vue.prototype.$axios = axios;
  const localStorage = window.localStorage;
  if(localStorage.token){
    const token = 'Bearer '+ localStorage.getItem('token');
    Vue.prototype.$axios.defaults.headers.common['Authorization'] = token
  }
}
