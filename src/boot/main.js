// import something here
const config = require('../config');
import { store } from '../store/store'



// "async" is optional
export default async ({ Vue }) => {
  //экспортируем наш конфиг для доступа из любого компонента
  Vue.prototype.appConfig = config;
  //экспортируем хранилище Vuex для доступа из любого компонента
  Vue.prototype.$store = store;
}
