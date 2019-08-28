import Vue from 'vue'
import VueRouter from 'vue-router'

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

  //определяем метод для роутов, который ограничивает доступ
  //к определенным роутам в зависимости от данных авторизации
  Router.beforeEach((to, from, next) => {
    //проверка, если нужен доступ как авторизованный пользователь
    if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.token == null) {
        next({
          path: '/login',
          params: { nextUrl: to.fullPath }
        })
      } else {
        //проверка, если нужен доступ как администратор
        if(to.matched.some(record => record.meta.is_admin)) {
          if(localStorage.group == 'administrator'){
            next()
          }
          else{
            alert('Ваши права доступа недостаточны')
          }
        }else {
          next()
        }
      }
      //проверка если не авторизованный пользователь(гость)
    } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
        next()
      }
      else{
        next({ path: '/'})
      }
    }else {
      next()
    }
  });

  return Router
}
