import Main from 'components/main.vue'
import Dostavka from 'pages/dostavka.vue'
import Oplata from 'pages/oplata.vue'
import Users from 'components/admin/users.vue'
import Users_add from 'components/admin/users_add.vue'
import Products from 'components/admin/products.vue'
import Products_add from 'components/admin/products_add.vue'
import Categories from 'components/admin/categories.vue'
import Categories_add from 'components/admin/categories_add.vue'
import Companies from 'components/admin/companies.vue'
import Companies_add from 'components/admin/companies_add.vue'
import Orders from 'components/admin/orders.vue'
import Statistics from 'components/admin/statistics.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', components: {content: Main}},
      { path: '/dostavka', components: {content: Dostavka}},
      { path: '/oplata', components: {content: Oplata}},
    ]
    },
  {
    path: '/admin',
    component: () => import('layouts/Admin.vue'),
    children: [
      { path: '/admin/users', components: {admin_content: Users}},
      { path: '/admin/users_add', components: {admin_content: Users_add}},
      { path: '/admin/products', components: {admin_content: Products}},
      { path: '/admin/products_add', components: {admin_content: Products_add}},
      { path: '/admin/categories', components: {admin_content: Categories}},
      { path: '/admin/categories_add', components: {admin_content: Categories_add}},
      { path: '/admin/companies', components: {admin_content: Companies}},
      { path: '/admin/companies_add', components: {admin_content: Companies_add}},
      { path: '/admin/orders', components: {admin_content: Orders}},
      { path: '/admin/statistics', components: {admin_content: Statistics}},
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
