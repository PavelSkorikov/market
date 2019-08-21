<template>
  <div class="q-pa-md q-gutter-y-sm">

    <!-- тулбар для страницы -->
    <q-toolbar class="bg-grey-8 text-white shadow-2">
      <q-input flat dark dense standout v-model="search_text" input-class="text-right" class="q-ml-md">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-space />
      <q-btn flat @click="form_add = true" label="Добавить пользователя" outline color="white" />
      <q-btn flat @click="edit_select" label="Изменить" outline color="white" />
      <div class="text-white q-gutter-xs">
        <q-btn @click="dialog_delete = true" class="gt-xs" size="12px"
               flat
               dense round
               icon="delete" />
      </div>
    </q-toolbar>

    <!-- таблица пользователей -->
    <q-table
      class="my-sticky-header-table"
      :data="data_users"
      :columns="columns_users"
      row-key="email"
      :pagination.sync="pagination"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      flat
      bordered
    />

    <!-- диалог подтверждения удаления пользователя -->
    <q-dialog v-model="dialog_delete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Удалить выбранное?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Нет" color="primary" v-close-popup />
          <q-btn flat label="Да" color="primary"  @click="del" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- форма создания нового пользователя -->
    <q-dialog v-model="form_add">
      <q-card class="my-card" style="min-width: 700px">
        <q-bar  class="bg-positive text-white">
          <div>Создать пользователя</div>
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
                <!-- поле выбора группы для пользователя -->
                <q-select
                  v-model="userData.group"
                  :options="groups"
                  label="Группа" />
                <!-- поле выбора статуса пользователя -->
                <q-select
                  v-model="userData.status"
                  :options="userStatuses"
                  label="Статус" />
                <!-- поле ввода скидки для пользователя -->
                <q-input
                  filled
                  type="number"
                  prefix="%"
                  v-model="userData.discount"
                  square
                  label="Скидка"
                />
                <!-- кнопки выбора действия -->
                <div>
                  <q-btn @click="add" label="Добавить" type="submit" color="primary"/>
                  <q-btn @click="userData = {}" label="Сброс" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
              </q-form>
            </q-card-section>
      </q-card>
    </q-dialog>

    <!-- форма для изменения данных пользователя -->
    <q-dialog v-model="form_edit">
      <q-card class="my-card" style="min-width: 700px">
        <q-bar  class="bg-positive text-white">
          <div>Изменить пользователя</div>
          <q-space />
          <q-btn dense flat icon="close" @click="userData_edit={}" v-close-popup></q-btn>
        </q-bar>
        <q-card-section>
          <q-form  class="q-gutter-md">
            <!-- поле ввода e-mail -->
            <q-input
              square
              filled type="email"
              v-model="userData_edit.email"
              label="E-mail"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']">
              <template v-slot:before>
                <q-icon name="mail" />
              </template>
            </q-input>
            <!-- поле выбора группы для пользователя -->
            <q-select
              v-model="userData_edit.group"
              :options="groups"
              label="Группа" />
            <!-- поле выбора статуса пользователя -->
            <q-select
              v-model="userData_edit.status"
              :options="userStatuses"
              label="Статус" />
            <!-- поле ввода скидки для пользователя -->
            <q-input
              filled
              type="number"
              prefix="%"
              v-model="userData_edit.discount"
              square
              label="Скидка"
            />
            <!-- кнопки выбора действия -->
            <div>
              <q-btn @click="edit" label="Изменить" type="submit" color="primary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
</style>

<script>
  import axios from 'axios';

export default {
  name: 'Users',
  data() {
    return {
      search_text: '',
      userData: {},
      userData_edit: {},
      groups: ['administrator', 'user'],
      users: null,
      userStatuses: ['Заблокирован', 'Активен'],
      isPwd: true,
      dialog_delete: false,
      form_add: false,
      form_edit: false,
      selected: [],
      columns_users: [
        {
          name: 'email',
          required: true,
          label: 'E-mail',
          align: 'left',
          field: row => row.email,
          sortable: true
        },
        {name: 'group', label: 'Права доступа', field: 'group', sortable: true},
        {name: 'status', label: 'Статус', field: 'status', sortable: true},
        {name: 'discount', label: 'Скидка', field: 'discount', sortable: true},
        {name: 'updatedAt', label: 'Изменен', field: 'updatedAt', sortable: true},
      ],
      pagination: {
        sortBy: 'updatedAt',
        descending: true,
        page: 0,
        rowsPerPage: 0
      },
    }
  },

  // при открытии страницы получаем список пользователей
  mounted() {
    this.getUsers();
  },

  computed: {
    // метод формирования списка пользователей для вывода на экран
    data_users: function () {
      //если загружены с сервера данные
      if (this.users){
        //если в строке поиска ничего не набрано выводим список пользователей как есть
        if (!this.search_text) return this.users;
        //иначе фильтруем список поьлзователей по заданному слову из строки поиска
        else {
          let data = [];
          for (let user of this.users) {
            let email = user.email.toLowerCase();
            if (email.indexOf(this.search_text.toLowerCase()) !== -1) {
              data.push(user);
            }
          }
          return data;
        }
      }
    },
  },

  methods: {

    // метод получения списка пользователей с сервера
    getUsers() {
      axios
        .get(this.appConfig.api_url + '/getUsers')
        .then(response => (this.users = response.data))
        .catch(function (err) {
          alert('Не удалось получить список пользователей')
        });
    },

    // получение списка выбранных строк из таблицы
    getSelectedString() {
      return this.selected.length === 0 ? '' :
        `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.selected.length}`
    },

    // метод создания пользователя
    add() {
      if (this.userData.email) {
        axios.post(this.appConfig.api_url + '/addUser',
          this.userData
        ).then((res) => {
          console.log('Ответ сервера:', res);
          if (res.status == 200) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'fas fa-check-circle',
              message: 'Добавлено'
            });
            this.getUsers();
          }
        })
          .catch(function (err) {
            alert('Ошибка - объект не добавлен');
          });
        this.userData = {};
      }
    },

    //удаление выбранного пользователя
    del() {
      if (this.selected.length == 0) {
        alert('Ничего не выбрано');
        return;
      }
      for (let i = 0; i < this.selected.length; i++) {
        axios
          .delete(this.appConfig.api_url + '/delUser', {
              params: {
                id: this.selected[i].id
              }
            }
          ).then((res) => {
          if (res.status == 204) this.getUsers();
        }).catch(function (err) {
          alert('Удалить не получилось');
        })
      }
      this.selected = [];
    },

    //метод заполнения данными формы для редактирования пользователя
    edit_select() {
      // если строка в таблице не выбрана или выбрано больше одной строки
      // выводим сообщение об ошибке
      if (this.selected.length == 0 || this.selected.length > 1) {
        alert('Выберете одного пользователя для изменения');
        return;
      }
      // заполняем форму данными выбранного пользователя
      // которые берем из объекта this.selected[0](отмеченная галочкой строка) таблицы
      this.userData_edit.id = this.selected[0].id;
      this.userData_edit.email = this.selected[0].email;
      this.userData_edit.group = this.selected[0].group;
      this.userData_edit.status = this.selected[0].status;
      this.userData_edit.discount = this.selected[0].discount;
      // открываем форму с полученными данными пользователя
      this.form_edit = true;
    },

    //метод изменения данных пользователя
    edit() {
      if (this.userData.email) {
        axios
          .put(this.appConfig.api_url + '/putUser', this.userData_edit)
          .then((res) => {
            console.log('Ответ сервера:', res);
            if (res.status == 204) {
              this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'fas fa-check-circle',
                message: 'Изменено'
              });
            }
            this.getUsers();
          })
          .catch(function (err) {
            alert('Ошибка - объект не изменен');
          });
        this.selected = [];
        this.form_edit = false;
      }
    },

  }
}
</script>
