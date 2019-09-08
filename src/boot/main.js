import axios from "axios";

const config = require('../config');
import { store } from '../store/store'


//перехватчик ответов сервера для axios(нужен для обновления jwt - токена)
axios.interceptors.response.use(response => response, error => {
  const status = error.response ? error.response.status : null;
  //если в ответе 401 ошибка(нет доступа - протух токен)
  if (status === 401) {
    //делаем запрос к серверу на обновление токена с помощью refreshtoken
    axios.post(config.auth_url + '/refresh', {
      refreshtoken: sessionStorage.refreshtoken
    })
      .then(res => {
        // сохраняем новые токен и refreshtoken в хранилище sessionStorage и хранилище Vuex
        const token = 'Bearer ' + res.data.token;
        const refreshtoken  = res.data.refreshtoken;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshtoken', refreshtoken);
        store.state.token = token;
        store.state.refreshtoken = refreshtoken;
        // записываем полученный токен в заголовок авторизации для всех запросов axios
        axios.defaults.headers.common['Authorization'] = token;
      })
      .catch(err => {
        console.log('сбой авторизации' + err);
      });
    // после получения нового токена задаем параметры для повторного захода на требуемый url
    error.config.headers['Authorization'] = sessionStorage.token;
    error.config.baseURL = undefined;
    // повторяем вход, куда нам было нужно только теперь с новым токеном
    return axios.request(error.config);
  }
  return Promise.reject(error);
});

// "async" is optional
export default async ({ Vue }) => {
  //экспортируем наш конфиг для доступа из любого компонента
  Vue.prototype.appConfig = config;
  //экспортируем хранилище Vuex для доступа из любого компонента
  Vue.prototype.$store = store;
}
