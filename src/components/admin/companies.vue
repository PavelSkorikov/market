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
        <q-item-section @click="name=company.name, description=company.description, form_edit=true"> {{company.name}}
        </q-item-section>
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

  <!-- form for create company-->
    <q-dialog v-model="form_add">
      <q-card>
        <q-bar  class="bg-positive text-white">
          <div>Добавить новую компанию</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="row items-center">
          <q-form  class="q-gutter-md">
            <q-input
              square
              filled
              v-model="name"
              label="Название компании"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
            />
            <q-input
              type = 'textarea'
              square
              outlined
              v-model="description"
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
      <q-card>
        <q-bar  class="bg-positive text-white">
          <div>Редактировать компанию</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="row items-center">
          <q-form  class="q-gutter-md">
            <q-input
              square
              filled
              v-model="name"
              label="Название компании"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
            />
            <q-input
              type = 'textarea'
              square
              outlined
              v-model="description"
              label="Описание"
            />
            <div>
              <q-btn @click="edit" label="Изменить" type="submit" color="primary"/>
              <q-btn @click="name = null, description = null" label="Сброс" type="reset" color="primary" flat
                     class="q-ml-sm" />
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
      item: {},
      companies: null,
      dialog_delete: false,
      form_add: false,
      form_edit: false,
      name: null,
      description: null,
    }
  },
    //при открытии компонента загружаем с сервера список Компаний
  mounted() {
    axios
    .get('http://127.0.0.1:3000/getCompany')
      .then(response => (this.companies = response.data));
  },
  methods: {
    //метод получения списка компаний от сервера
    get_companies() {
      axios
        .get('http://127.0.0.1:3000/getCompany')
        .then(response => (this.companies = response.data));
    },
    //метод - удаление компании
    del(company) {
          axios
          .delete('http://127.0.0.1:3000/delCompany', {
            params: {
              id: company
            }
          }).then((res) => {
          console.log('Ответ сервера:', res);
          if (res.status == 204) this.get_companies();
        }).catch(function (err) {
          alert('Удалить не получилось');
        })
    },
    // метод добавления компании
    add() {
      if(this.name) {
        axios.post('http://127.0.0.1:3000/addCompany', {
          name: this.name,
          description: this.description
        }).then((res) => {
          console.log('Ответ сервера:', res);
          if (res.status == 200) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'fas fa-check-circle',
              message: 'Отправлено'
            });
            this.get_companies();
            this.name = null;
            this.description = null;
          }
        })
          .catch(function (err) {
            alert('Ошибка - объект не добавлен');
          })
      }
    },
    edit() {
      if(this.name) {
        axios.put()
      }
    }


    }
  }
</script>
<style>
</style>
