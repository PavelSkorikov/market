<template>
  <q-layout view="Hhh lpr Fff">
    <q-header reveal elevated class="bg-grey-8 text-white">
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
      <q-toolbar>
          <q-avatar v-go-back=" '/' " style="cursor: pointer">
            <img src="/assets/logo-market.png">
          </q-avatar>
        <q-toolbar-title style="cursor: pointer">Страница администратора</q-toolbar-title>
        <q-btn flat style="color: orange" label="Выход" to="/" />
      </q-toolbar>
        </div>
        <div class="col-2"></div>
      </div>

      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <q-tabs align="left" class="bg-positive" text-color="white">
              <q-route-tab to="/admin/users" icon="account_box" label="Пользователи">
                <q-badge color="orange" floating>{{countUsers}}</q-badge>
              </q-route-tab>
              <q-route-tab to="/admin/products" icon="category" label="Товары">
                <q-badge color="orange" floating>{{countProducts}}</q-badge>
              </q-route-tab>
              </q-tab>
              <q-route-tab to="/admin/categories" icon="format_align_left" label="Категории">
                <q-badge color="orange" floating>{{countCategories}}</q-badge>
              </q-route-tab>
              </q-tab>
              <q-route-tab to="/admin/companies" icon="domain" label="Компании">
                <q-badge color="orange" floating>{{countCompanies}}</q-badge>
              </q-route-tab>
              <q-route-tab name="orders" to="/admin/orders" icon="shop" label="Заказы">
                <q-badge color="orange" floating>{{countOrders}}</q-badge>
              </q-route-tab>
              <q-route-tab to="/admin/statistics" icon="insert_chart" label="Статистика" />
            </q-tabs>
        </div>
        <div class="col-2"></div>
      </div>
    </q-header>

    <div class="row">
      <div class="col-2"></div>
      <div class="col-8">
        <q-page-container>
          <router-view name="admin_content" />
        </q-page-container>
      </div>
      <div class="col-2"></div>
    </div>

  </q-layout>
</template>

<script>

  export default {
    name: 'Admin',
    data () {
      return {
        countUsers: '0',
        countProducts: '0',
        countCategories: '0',
        countCompanies: '0',
        countOrders: '0'
      }
    },

    // при открытии страницы запрашиваем от сервера количество
    created() {
      this.get_count();
    },
    // при обновлении страницы запрашиваем от сервера количество
    updated() {
      this.get_count();
    },

    methods: {
      // метод который опрашивает сервер для получения количества пользователей,
      // товаров, категорий, компаний, заказов
      get_count(){
        this.$axios.get(this.appConfig.admin_url + '/countItems')
          .then(response => {
            this.countUsers = response.data.user;
            this.countProducts = response.data.product;
            this.countCompanies = response.data.company;
            this.countCategories = response.data.category;
          })
          .catch(function (err) {
            alert('Не удалось получить количество элементов в базе данных')
          });
      }
    }

  }
</script>

<style>
</style>
