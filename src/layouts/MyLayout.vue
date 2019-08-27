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
        <q-btn v-if="appConfig.token" to="/admin" flat style="color: white" label="Админ" />
        <q-btn flat style="color: white" label="Регистрация" />
        <q-btn flat style="color: orange" :label="label_login" @click="select_login"/>
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
              <q-route-tab to="/catalog" icon="menu" label="Каталог" />
              <span style="color: #21BA45">eweqedsf</span>
              <q-input outlined bg-color="white" v-model="text" :dense="dense" placeholder="Поиск товара">
                <template v-slot:append>
                  <q-icon color="primary" name="search"/>
                </template>
              </q-input>
              <q-route-tab to="/oplata" icon="money" label="Оплата"/>
              <q-route-tab to="/dostavka" icon="local_shipping" label="Доставка"/>
              <q-tab name="equalizer" icon="equalizer" label="Сравнение">
                <q-badge color="orange" floating>0</q-badge>
              </q-tab>
              <q-tab name="favorite" icon="favorite" label="Избранное">
                <q-badge color="orange" floating>0</q-badge>
              </q-tab>
              <q-tab name="basket" icon="shopping_cart" label="Корзина">
                <q-badge color="orange" floating>0</q-badge>
              </q-tab>
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

    <!-- форма входа пользователя -->
    <q-dialog v-model="login_form">
      <q-card class="my-card" style="min-width: 400px">
        <q-bar  class="bg-positive text-white">
          <div>ВОЙТИ</div>
          <q-space />
          <q-btn dense flat icon="close" @click="userData={}" v-close-popup></q-btn>
        </q-bar>
        <q-card-section>
          <q-form  class="q-gutter-md">
            <!-- поле ввода e-mail -->
            <q-input
              square
              filled type="email"
              v-model="userData.email"
              label="E-mail"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']">
              <template v-slot:before>
                <q-icon name="mail" />
              </template>
            </q-input>
            <!-- поле ввода пароля -->
            <q-input
              v-model="userData.password"
              label="Пароль"
              filled
              :type="isPwd ? 'password' : 'text'"
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div>
              <q-btn @click="login" label="ВХОД" type="submit" color="primary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
  import axios from 'axios';
  import Menu from "../components/menu";

  export default {
    components: {Menu},
    data () {
      return {
        text: '',
        dense: true,
        label_login: 'Войти',
        login_form: false,
        userData: {},
        isPwd: true,
      }
    },

    methods: {
      //выбор действия login или logout в зависимости от состояния авторизации
      select_login() {
        if(!this.appConfig.token) this.login_form = true;
        else this.logout();
      },

      // логин пользователя
      login(){
        if (this.userData.email && this.userData.password) {
          // отправляем email и пароль пользователя на сервер для аутентификации
          axios.post(this.appConfig.auth_url + '/login',
            this.userData
          ).then((res) => {
            // при успешной аутентификации получаем с сервера jwt токен и refreshtoken
            this.appConfig.token = res.data.token;
            this.appConfig.refreshtoken = res.data.refreshtoken;
            this.label_login = 'Выйти';
            this.login_form = false;
            this.userData = {};
          })
          .catch(function (err) {
              alert('e-mail или пароль неверен, поробуйте еще раз');
            });
          this.userData = {};
        }
      },

      //логаут пользователя
      logout() {
        this.appConfig.token = null;
        this.appConfig.refreshtoken = null;
        this.label_login = 'Войти';
      }
    }

  }
</script>

<style>
</style>
