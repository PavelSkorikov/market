<template>
  <div class="q-pa-md">
    <!-- header for this component-->
    <q-toolbar class="bg-grey-8 text-white shadow-2">
      <q-toolbar-title>Компании - производители</q-toolbar-title>
      <q-btn @click="form_add = true" label="Добавить" outline color="white" />
    </q-toolbar>

    <!-- companies list -->
    <q-list bordered separator>
      <q-item v-for="company in companies" :key="company.id" clickable v-ripple>
        <q-item-section @click="companyData=company, form_edit=true">
          {{company.name}}
        </q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn @click="dialog_delete = true, companyData = company" class="gt-xs" size="12px"
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
          <span class="q-ml-sm">Вы уверены, что хотите удалить компанию {{companyData.name}}?</span>
        </q-card-section>
        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn flat label="Нет" color="primary" v-close-popup />
          <q-btn flat label="Да" color="primary"  @click="del" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  <!-- form for create company-->
    <q-dialog v-model="form_add">
      <q-card style="min-width: 400px">
        <q-bar  class="bg-positive text-white">
          <div>Добавить новую компанию</div>
          <q-space />
          <q-btn dense flat icon="close" @click="companyData={}" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="row items-center">
          <q-form  class="q-gutter-md">
            <q-input
              square
              filled
              v-model="companyData.name"
              label="Название компании"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
              style="min-width: 370px"
            />
            <q-input
              type = 'textarea'
              square
              outlined
              v-model="companyData.description"
              label="Описание"
            />
            <div>
              <q-btn @click="add" label="Добавить" type="submit" color="primary"/>
              <q-btn @click="name = null, description = null" label="Сброс" type="reset" color="primary" flat
                     class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- form for edit company -->
    <q-dialog v-model="form_edit">
      <q-card style="min-width: 400px">
        <q-bar  class="bg-positive text-white">
          <div>Редактировать компанию</div>
          <q-space />
          <q-btn dense flat icon="close" @click="companyData={}" v-close-popup ></q-btn>
        </q-bar>
        <q-card-section class="row items-center">
          <q-form  class="q-gutter-md">
            <q-input
              square
              filled
              v-model="companyData.name"
              label="Название компании"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
              style="min-width: 370px"
            />
            <q-input
              type = 'textarea'
              square
              outlined
              v-model="companyData.description"
              label="Описание"
            />
            <div>
              <q-btn @click="edit" label="Изменить" type="submit" color="primary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
  import axios from 'axios';

  export default {
  name: 'Companies',
  data() {
    return {
      companyData: {},
      companies: null,
      dialog_delete: false,
      form_add: false,
      form_edit: false,
    }
  },
    //при открытии компонента загружаем с сервера список Компаний
  mounted() {
    axios
    .get(this.appConfig.api_url+'/getCompany')
      .then(response => (this.companies = response.data));
  },
  methods: {
    //метод получения списка компаний от сервера
    get_categories() {
      axios
        .get(this.appConfig.api_url+'/getCompany')
        .then(response => (this.companies = response.data));
    },
    //метод - удаление компании
    del() {
          axios
          .delete(this.appConfig.api_url+'/delCompany', {
            params: {
              id: this.companyData.id
            }
          }).then((res) => {
          console.log('Ответ сервера:', res);
          if (res.status == 204) this.get_categories();
        }).catch(function (err) {
          alert('Удалить не получилось');
        })
      this.companyData = {};
    },
    // метод добавления компании
    add() {
      if(this.companyData.name) {
        axios.post(this.appConfig.api_url+'/addCompany', {
          name: this.companyData.name,
          description: this.companyData.description
        }).then((res) => {
          console.log('Ответ сервера:', res);
          if (res.status == 200) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'fas fa-check-circle',
              message: 'Добавлено'
            });
            this.get_categories();
          }
        })
          .catch(function (err) {
            alert('Ошибка - объект не добавлен');
          })
      }
      this.companyData = {};
    },
    edit() {
      if(this.companyData.name) {
        console.log(this.companyData.id);
        axios
          .put(this.appConfig.api_url+'/putCompany', {
              id: this.companyData.id,
              name: this.companyData.name,
              description: this.companyData.description
          }).then((res)=> {
              console.log('Ответ сервера:', res);
              if (res.status == 204) {
                this.$q.notify({
                  color: 'green-4',
                  textColor: 'white',
                  icon: 'fas fa-check-circle',
                  message: 'Изменено'
                });
              }
              this.get_categories();
          })
          .catch(function (err) {
            alert('Ошибка - объект не изменен');
          })
        }
      this.companyData = {};
      }

    }

    }
</script>
<style>
</style>
