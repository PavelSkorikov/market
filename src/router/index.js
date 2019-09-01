import Vue from 'vue'
import VueRouter from 'vue-router'

import { store } from '../store/store'

import routes from './routes'

Vue.use(VueRouter);


/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  //создаем правила доступа для маршрутов на основании информации об авторизации пользователя
  Router.beforeEach((to, from, next) => {
    // если маршрут требует прав администратора
    if(to.matched.some(record => record.meta.is_admin)) {
      // проверяем в хранилище Vuex авторизован ли пользователь и является ли он администратором
      if (store.getters.isLoggedIn && store.getters.isAdmin == 'administrator') {
        // если да разрешаем доступ
        next();
        return
      }
      // иначе выдаем ошибку и отправляем на страницу авторизации
      alert('Ваши правадоступа недостаточны');
      next('/login')
    } else {
      next()
    }
  });

  return Router
}
