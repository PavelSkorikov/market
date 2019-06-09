<template>
  <q-layout view="hHh LpR fFf">

    <q-header reveal elevated class="bg-primary text-white">
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
      <q-toolbar>
        <q-toolbar-title>
          SuperMarket
        </q-toolbar-title>

      </q-toolbar>
        </div>
        <div class="col-2"></div>
      </div>

      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
      <q-tabs align="left">
        <q-route-tab to="/page1" label="Каталог" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
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
      }
    }
  }
</script>

<style>
</style>
