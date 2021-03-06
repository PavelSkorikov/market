import Main from 'components/main.vue'
import Dostavka from 'pages/dostavka.vue'
import Oplata from 'pages/oplata.vue'
import Users from 'components/admin/users.vue'
import Products from 'components/admin/products.vue'
import Categories from 'components/admin/categories.vue'
import Companies from 'components/admin/companies.vue'
import Orders from 'components/admin/orders.vue'
import Statistics from 'components/admin/statistics.vue'
import Login from 'components/auth/login.vue'
import Register from 'components/auth/register.vue'


const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', components: {content: Main}},
      { path: '/dostavka', components: {content: Dostavka}},
      { path: '/oplata', components: {content: Oplata}},
      { path: '/login',  components: {content: Login}},
      { path: '/register',  components: {content: Register}},
    ]
    },

  {
    path: '/admin',
    name: 'admin',
    component: () => import('layouts/Admin.vue'),
    children: [
      { path: '/admin/users', components: {admin_content: Users}},
      { path: '/admin/products', components: {admin_content: Products}},
      { path: '/admin/categories', components: {admin_content: Categories}},
      { path: '/admin/companies', components: {admin_content: Companies}},
      { path: '/admin/orders', components: {admin_content: Orders}},
      { path: '/admin/statistics', components: {admin_content: Statistics}},
    ],
    // прописываем в meta что данный маршрут требует авторизации и прав администратора
    // сама логика обработки данного ограничения находится в index.js
    meta: {
      is_admin : true
    }
  }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}


export default routes
