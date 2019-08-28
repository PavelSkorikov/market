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
      <q-btn flat @click="form_password=true" label="Сменить пароль" outline color="white" />
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
      row-key="name"
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
            <!-- поле ввода имени пользователя -->
            <q-input
              square
              filled type="text"
              v-model="userData.name"
              label="Имя"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите имя']">
            </q-input>
            <!-- поле ввода e-mail -->
            <q-input
              square
              filled type="email"
              v-model="userData.email"
              label="E-mail"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите e-mail']">
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
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите пароль']">
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

    <!-- форма смены пароля пользователя -->
    <q-dialog v-model="form_password">
      <q-card class="my-card" style="min-width: 700px">
        <q-bar  class="bg-positive text-white">
          <div>Сменить пароль</div>
          <q-space />
          <q-btn dense flat icon="close" @click="userData={}" v-close-popup></q-btn>
        </q-bar>
        <q-card-section>
          <q-form  class="q-gutter-md">
            <!-- поле ввода пароля -->
            <q-input
              v-model="password"
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
              <q-btn @click="change_password" label="Сменить" type="submit" color="primary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- форма для изменения данных пользователя -->
    <q-dialog v-model="form_edit">
      <q-card class="my-card" style="min-width: 700px">
        <q-bar  class="bg-positive text-white">
          <div>Изменить данные пользователя</div>
          <q-space/>
          <q-btn dense flat icon="close" @click="userData={}, selected=[]" v-close-popup></q-btn>
        </q-bar>
            <q-card-section>
              <q-form>
                <!-- поле ввода имени пользователя -->
                <q-input
                  square
                  filled type="text"
                  v-model="name"
                  label="Имя"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Пожалуйста введите имя']">
                </q-input>
                <q-input
                  square
                  filled type="email"
                  v-model="email"
                  label="E-mail"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']">
                  <template v-slot:before>
                    <q-icon name="mail" />
                  </template>
                </q-input>
                <!-- поле выбора группы для пользователя -->
                <q-select
                  v-model="group"
                  :options="groups"
                  label="Группа" />
                <!-- поле выбора статуса пользователя -->
                <q-select
                  v-model="status"
                  :options="userStatuses"
                  label="Статус" />
                <!-- поле ввода скидки для пользователя -->
                <q-input
                  filled
                  type="number"
                  prefix="%"
                  v-model.number="discount"
                  square
                  label="Скидка"
                />
              </q-form>
            </q-card-section>
          <q-card-actions>
              <q-btn @click="edit" label="Изменить" type="submit" color="primary"/>
          </q-card-actions>
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
      id: null,
      name: null,
      email: null,
      password: null,
      group: null,
      discount: null,
      status: null,
      groups: ['administrator', 'user'],
      users: null,
      userStatuses: ['offline', 'online'],
      isPwd: true,
      dialog_delete: false,
      form_add: false,
      form_edit: false,
      form_password: false,
      selected: [],
      columns_users: [
        {
          name: 'name',
          required: true,
          label: 'Имя',
          align: 'left',
          field: row => row.name,
          sortable: true
        },
        {name: 'email', label: 'E-mail', field: 'email', sortable: true},
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
            let name = user.name.toLowerCase();
            if (name.indexOf(this.search_text.toLowerCase()) !== -1) {
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
        .get(this.appConfig.admin_url + '/getUsers')
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
        axios.post(this.appConfig.admin_url + '/addUser',
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
          .delete(this.appConfig.admin_url + '/delUser', {
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
      this.id = this.selected[0].id;
      this.name = this.selected[0].name;
      this.email = this.selected[0].email;
      this.group = this.selected[0].group;
      this.status = this.selected[0].status;
      this.discount = this.selected[0].discount;
      //открываем форму
      this.form_edit = true;
    },

    //метод изменения данных пользователя
    edit() {
      if (this.id && this.name && this.email && this.group && this.status) {
        axios
          .put(this.appConfig.admin_url + '/putUser', {
            id: this.id,
            name: this.name,
            email: this.email,
            group: this.group,
            status: this.status,
            discount: this.discount
          })
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
        this.id = null;
        this.name = null;
        this.email = null;
        this.group = null;
        this.status = null;
        this.discount = null;
        this.form_edit = false;
      }
    },

    //метод смены пароля для выбранного пользователя
    change_password() {
      // если строка в таблице не выбрана или выбрано больше одной строки
      // выводим сообщение об ошибке
      if (this.selected.length == 0 || this.selected.length > 1) {
        alert('Выберете одного пользователя для изменения');
        return;
      }
      if (this.password) {
        axios
          .put(this.appConfig.admin_url + '/putUser', {
            id: this.selected[0].id,
            password: this.password
          })
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
        this.password = null;
        this.form_password = false;
      }
    },

  }
}
</script>
