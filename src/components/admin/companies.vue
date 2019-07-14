<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-grey-8 text-white shadow-2">
      <q-toolbar-title>Компании - производители</q-toolbar-title>
      <q-btn to="/admin/companies_add" label="Добавить" outline color="white" />
    </q-toolbar>
    <!-- companies list -->
    <q-list bordered separator>
      <q-item v-for="company in companies" :key="company.id" clickable v-ripple>
        <q-item-section>{{company.name}}</q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn @click="dialog_delete = true, item = company" class="gt-xs" size="12px"
                   flat
                   dense round
                   icon="delete" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- dialog for delete submit -->
    <q-dialog v-model="dialog_delete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Вы уверены, что хотите удалить компанию {{item.name}}?</span>
        </q-card-section>
        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn flat label="Нет" color="primary" v-close-popup />
          <q-btn flat label="Да" color="primary"  @click="del(item.id)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  import routes from '../../router/routes.js';

  export default {
  name: 'Companies',
  data() {
    return {
      item: {},
      companies: null,
      dialog_delete: false
    }
  },
    //при открытии компонента загружаем с сервера список Компаний
  mounted() {
    axios
      .get('http://127.0.0.1:3000/getCompany')
      .then(response => (this.companies = response.data));
  },
  methods: {
    //метод - удаление компании
    del(company) {
          axios
          .delete('http://127.0.0.1:3000/delCompany', {
            params: {
              id: company
            }
          }).then((res) => {
          console.log('Ответ сервера:', res);
          if (res.status == 204) {
            axios
              .get('http://127.0.0.1:3000/getCompany')
              .then(response => (this.companies = response.data));
          }
        }).catch(function (err) {
          alert('Удалить не получилось');
        })
    }
  }
}
</script>
<style>
</style>
