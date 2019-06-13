<template>
  <q-layout view="Hhh lpr Fff">

    <q-header reveal elevated class="bg-grey-8 text-white">
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
      <q-toolbar>
          <q-avatar>
            <img src="/assets/logo-market.png">
          </q-avatar>
        <q-toolbar-title>Online Магазин</q-toolbar-title>
        <q-btn flat style="color: white" label="Регистрация" />
        <q-btn flat style="color: orange" label="Вход" />
      </q-toolbar>
        </div>

        <div class="col-2"></div>
      </div>

      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <q-tabs align="left" class="bg-positive" text-color="white">
              <q-icon color="primary" name="catalog" />
              <q-route-tab to="/page2" icon="menu" label="Каталог" />
              <span style="color: #21BA45">eweqe</span>
              <q-input outlined bg-color="white" v-model="text" :dense="dense" placeholder="Поиск товара">
                <template v-slot:append>
                  <q-icon color="primary" name="search"/>
                </template>
              </q-input>
              <q-route-tab to="/page3" icon="money" label="Оплата"/>
              <q-route-tab to="/page3" icon="local_shipping" label="Доставка"/>
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

    <div class="row">
      <div class="col-2"></div>
      <div class="col-8">
        <q-page-container>
          <router-view />
        </q-page-container>
      </div>
      <div class="col-2"></div>
    </div>



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
  export default {
    data () {
      return {
        text: '',
        dense: true
      }
    }
  }
</script>

<style>
</style>
