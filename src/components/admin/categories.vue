<template>
  <div class="q-pa-md">
    <!-- header for this component-->
    <q-toolbar class="bg-grey-8 text-white shadow-2">
      <q-toolbar-title>Категории товара</q-toolbar-title>
      <q-btn @click="form_add = true" label="Добавить" outline color="white" />
    </q-toolbar>

    <!-- categories list -->
    <q-tree
      :nodes="categories_tree"
      node-key="label"
    />

    <q-list bordered separator>
      <q-item v-for="category in categories" :key="category.id" clickable v-ripple>
        <q-item-section @click="categoryData=category, form_edit=true">
          {{category.name}}
        </q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn @click="dialog_delete = true, categoryData = category" class="gt-xs" size="12px"
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
          <span class="q-ml-sm">Вы уверены, что хотите удалить компанию {{categoryData.name}}?</span>
        </q-card-section>
        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn flat label="Нет" color="primary" v-close-popup />
          <q-btn flat label="Да" color="primary"  @click="del" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- form for create category-->
    <q-dialog v-model="form_add" >
      <q-card style="min-width: 500px">
        <q-bar  class="bg-positive text-white">
          <div>Добавить категорию</div>
          <q-space />
          <q-btn dense flat icon="close" @click="categoryData={}" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="row items-center">
          <q-form  class="q-gutter-md">
            <q-input
              square
              filled
              v-model="categoryData.name"
              label="Название категории"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
              style="min-width: 470px"
            />
            <q-select v-model="categoryData.parent_name" :options="category_names" label="Родительская категория" />
            <q-input
              type = 'textarea'
              square
              outlined
              v-model="categoryData.description"
              label="Описание"
            />
            <q-toggle
              v-model="availability"
              color="green"
              label="Доступна"
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

    <!-- form for edit category -->
    <q-dialog v-model="form_edit">
      <q-card>
        <q-bar  class="bg-positive text-white">
          <div>Редактировать компанию</div>
          <q-space />
          <q-btn dense flat icon="close" @click="categoryData={}" v-close-popup ></q-btn>
        </q-bar>
        <q-card-section class="row items-center">
          <q-form  class="q-gutter-md">
            <q-input
              square
              filled
              v-model="categoryData.name"
              label="Название компании"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
            />
            <q-input
              type = 'textarea'
              square
              outlined
              v-model="categoryData.description"
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
    name: 'Categories',
    data() {
      return {
        model: null,
        categoryData: {},
        categories: null,
        availability: true,
        dialog_delete: false,
        form_add: false,
        form_edit: false,
        categories_tree: [
          {
            label: 'Satisfied customers (with avatar)',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            children: [
              {
                label: 'Good food (with icon)',
                icon: 'restaurant_menu',
                children: [
                  {label: 'Quality ingredients'},
                  {label: 'Good recipe'}
                ]
              },
              {
                label: 'Good service (disabled node with icon)',
                icon: 'room_service',
                disabled: true,
                children: [
                  {label: 'Prompt attention'},
                  {label: 'Professional waiter'}
                ]
              },
              {
                label: 'Good service (disabled node with icon)',
                icon: 'room_service',
                disabled: true,
                children: [
                  {label: 'Prompt attention'},
                  {label: 'Professional waiter'}
                ]
              }
            ]
          }
        ]
      }
    },
    computed: {
      //computed a list of categories names for form "add category"
      category_names: function () {
        let names = [];
        for(let category of this.categories){
          names.push(category.name);
        }
        return names;
      },
      //computed a list of tree categories for visualization in page
      category_tree: function () {
        let tree = [];


      }
    },
        //with open a component load list categories from server
        mounted() {
          axios
            .get(this.appConfig.api_url + '/getCategory')
            .then(response => (this.categories = response.data));
        },
        methods: {
          //method get list categories from server
          get_categories() {
            axios
              .get(this.appConfig.api_url + '/getCategory')
              .then(response => (this.categories = response.data));
          },
          //method - delete category
          del() {
            axios
              .delete(this.appConfig.api_url + '/delCategory', {
                params: {
                  id: this.categoryData.id
                }
              }).then((res) => {
              console.log('Ответ сервера:', res);
              if (res.status == 204) this.get_categories();
            }).catch(function (err) {
              alert('Удалить не получилось');
            })
            this.categoryData = {};
          },
          // method - create category
          add() {
            if (this.categoryData.name) {
              console.log(this.categoryData.name);
              console.log(this.categoryData.description);
              console.log(this.categoryData.parent_name);
              console.log(this.availability);
              axios.post(this.appConfig.api_url + '/addCategory', {
                  name: this.categoryData.name,
                  description: this.categoryData.description,
                  parent_name: this.categoryData.parent_name,
                  availability: this.availability
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
            this.categoryData = {};
          },
          // method - edit category
          edit() {
            if (this.categoryData.name) {
              console.log(this.categoryData.id);
              axios
                .put(this.appConfig.api_url + '/putCompany', {
                  id: this.categoryData.id,
                  name: this.categoryData.name,
                  description: this.categoryData.description
                }).then((res) => {
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
            this.categoryData = {};
          }
        }
      }
</script>
<style>
</style>
