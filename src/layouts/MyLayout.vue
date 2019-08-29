<template>
  <q-layout view="Hhh lpr Fff">

    <!-- заголовок страницы -->
    <q-header reveal elevated class="bg-grey-8 text-white">
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
      <q-toolbar>
          <q-avatar v-go-back=" '/' " style="cursor: pointer">
            <img src="/assets/logo-market.png">
          </q-avatar>
        <q-toolbar-title v-go-back=" '/' " style="cursor: pointer">Online Магазин</q-toolbar-title>
        <q-btn to="/admin" flat style="color: white" v-if="localStorage.group == 'administrator'" label="Админ" />
        <q-btn flat style="color: white" label="Регистрация" v-if="!localStorage.token" to="/register" />
        <q-btn flat style="color: orange" label="Войти" v-if="!localStorage.token" to="/login" />
        <!--выпадающее меню пользователя -->
        <q-btn flat style="color: orange" :label="localStorage.name" v-if="localStorage.token">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Профиль</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Выйти</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- поисковая строка -->
        <q-input outlined bg-color="white" v-model="text" :dense="dense" placeholder="Поиск товара">
          <template v-slot:append>
            <q-icon color="primary" name="search"/>
          </template>
        </q-input>
      </q-toolbar>
        </div>
        <div class="col-2"></div>
      </div>

      <!-- верхнее меню страницы -->
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <q-tabs align="left" class="bg-positive" text-color="white">
              <q-icon color="primary" name="catalog" />
              <q-route-tab to="/" icon="home" label="Главная" />
              <q-route-tab to="/catalog" icon="menu" label="Каталог" />
              <q-route-tab to="/oplata" icon="money" label="Оплата"/>
              <q-route-tab to="/dostavka" icon="local_shipping" label="Доставка"/>
              <q-tab name="favorite" icon="favorite" label="Избранное">
                <q-badge color="orange" floating>0</q-badge>
              </q-tab>
              <q-tab name="basket" icon="shopping_cart" label="Корзина">
                <q-badge color="orange" floating>0</q-badge>
              </q-tab>
              <q-route-tab to="/confirm_order" icon="done_outline" label="Оформить заказ"/>
              <q-space />
              <div class="q-pa-md q-gutter-y-sm">
              </div>
            </q-tabs>
        </div>
        <div class="col-2"></div>
      </div>
    </q-header>

    <!-- блок содержимого страницы -->
    <div class="row">
      <div class="col-2"></div>
      <div class="col-2">
        <!-- каталог товаров -->
        <q-page-container>
          <Menu></Menu>
        </q-page-container>
      </div>
      <div class="col-6">
        <!-- информационное содержимое страницы -->
        <q-page-container>
          <router-view name="content" />
        </q-page-container>
      </div>
      <div class="col-2"></div>
    </div>

    <!-- футер -->
    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
  import axios from 'axios';
  import Menu from "../components/menu";

  export default {
    components: {Menu},
    data() {
      return {
        localStorage: window.localStorage,
        text: '',
        dense: true,
        login: false,
        userData: {},
        isPwd: true,
      }
    },
    methods: {
      //логаут пользователя
      logout() {
        this.localStorage.removeItem('token');
        this.localStorage.removeItem('refreshtoken');
        this.localStorage.removeItem('name');
        this.localStorage.removeItem('group');
        this.login = false;
        document.location.replace('/');
      }
    }
  }
</script>

<style>
</style>
