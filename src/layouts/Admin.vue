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
        <q-btn flat style="color: orange" label="Выход" />
      </q-toolbar>
        </div>
        <div class="col-2"></div>
      </div>

      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <q-tabs align="left" class="bg-positive" text-color="white">
              <q-tab name="users" @click="showing_users = true" icon="account_box" label="Пользователи">
                <q-badge color="orange" floating>0</q-badge>
                <q-menu v-model="showing_users"
                        transition-show="flip-right"
                        transition-hide="flip-left">
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup to="/admin/users_add">
                      <q-item-section>Добавить</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup to="/admin/users">
                      <q-item-section>Список</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-tab>
              <q-tab name="products" @click="showing_products = true" icon="category" label="Товары">
                <q-badge color="orange" floating>0</q-badge>
                <q-menu v-model="showing_products"
                        transition-show="flip-right"
                        transition-hide="flip-left">
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup to="/admin/products_add">
                      <q-item-section>Добавить</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup to="/admin/products">
                      <q-item-section>Список</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-tab>
              <q-tab name="categories" @click="showing_categories = true" icon="format_align_left" label="Категории">
                <q-badge color="orange" floating>0</q-badge>
                <q-menu v-model="showing_categories"
                        transition-show="flip-right"
                        transition-hide="flip-left">
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup to="/admin/categories_add">
                      <q-item-section>Добавить</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup to="/admin/categories">
                      <q-item-section>Список</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-tab>
              <q-tab name="companies" @click="showing_companies = true" icon="domain" label="Компании">
                <q-badge color="orange" floating>0</q-badge>
                <q-menu v-model="showing_companies"
                        transition-show="flip-right"
                        transition-hide="flip-left">
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup to="/admin/companies_add">
                      <q-item-section @click="">Добавить</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup to="/admin/companies">
                      <q-item-section>Список</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-tab>
              <q-route-tab name="orders" to="/admin/orders" icon="shop" label="Заказы">
                <q-badge color="orange" floating>0</q-badge>
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
    name: 'Admin'
    ,
    data () {
      return {
        showing_users: false,
        showing_products: false,
        showing_categories: false,
        showing_companies: false,
      }
    }
  }
</script>

<style>
</style>
