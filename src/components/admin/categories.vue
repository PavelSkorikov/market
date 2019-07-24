<template>
  <div class="q-pa-md">
    <!-- header for this component-->
    <q-toolbar class="bg-grey-8 text-white shadow-2">
      <q-toolbar-title>Категории товара</q-toolbar-title>
      <q-btn @click="form_add = true" label="Добавить" outline color="white" />
    </q-toolbar>

    <!-- categories tree -->
    <q-tree
      :nodes="category_tree"
      node-key="label"
      :selected.sync="selected"
    />

    <!-- dialog for delete submit -->
    <q-dialog v-model="dialog_delete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Вы уверены, что хотите удалить категорию {{categoryData.name}}
            и все подкатегории если таковые имеются?</span>
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
          <q-btn dense flat icon="close" @click="categoryData={}, selected=null" v-close-popup></q-btn>
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
            <div>
              <q-btn @click="add" label="Добавить" type="submit" color="primary"/>
              <q-btn @click="categoryData = {}" label="Сброс" type="reset" color="primary" flat
                     class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- form for edit category -->
    <q-dialog v-model="form_edit">
      <q-card style="min-width: 500px">
        <q-bar  class="bg-positive text-white">
          <div>Редактировать категорию</div>
          <q-space />
          <q-btn dense flat icon="close" @click="categoryData={}, selected=null" v-close-popup ></q-btn>
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
            <div>
              <q-btn @click="edit" label="Изменить" type="submit" color="primary"/>
              <q-btn @click="dialog_delete = true" label="Удалить" type="submit" color="primary" flat
                     class="q-ml-sm"/>
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
        selected: null,
        categoryData: {},
        categories: null,
        dialog_delete: false,
        form_add: false,
        form_edit: false,
      }
    },
    //with open a component load list categories from server
    mounted() {
      axios
        .get(this.appConfig.api_url + '/getCategory')
        .then(response => (this.categories = response.data));
    },
    watch: {
      selected: function (newSelected) {
        for(let category of this.categories){
          if(category.name == newSelected){
            this.categoryData.name = newSelected;
            this.categoryData.parent_name = category.parent_name;
            this.categoryData.description = category.description;
            this.categoryData.id = category.id;
            break;
          }
        }
        this.form_edit = true;
      }
    },
    computed: {
      //computed a list of categories names for forms "add category" and "edit category"
      category_names: function () {
        if (this.categories) {
          let names = [];
          for (let category of this.categories) {
            names.push(category.name);
          }
          return names;
        }
      },
      //computed a tree of categories for visualization in page
      category_tree: function () {
        if (this.categories) {
          let tree = [];
          var i = 0;
          // create tree with parents categories
          for (let category of this.categories) {
            if (!category.parent_name) {
              tree.push({
                'label': category.name,
                'children': []
              });
              i += 1;
            }
          }
          // recursive function for add category at tree
          function find_parent(elem, tree_items) {
            for (let item of tree_items) {
              if (item.label == elem.parent_name) {
                item.children.push({
                  'label': elem.name,
                  'children': []
                });
                i += 1;
                return;
              }
              if(item.children.length > 0) find_parent(elem, item.children);
            }
          }
          // for each category from categories create element tree categories
          while (i < this.categories.length) {
            for (let category of this.categories) {
              if (category.parent_name) {
                find_parent(category, tree);
              }
            }
          }
          return tree;
        }
      }
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
                  id: this.categoryData.id,
                  name: this.categoryData.name
                }
              }).then((res) => {
              console.log('Ответ сервера:', res);
              if (res.status == 204) this.get_categories();
            }).catch(function (err) {
              alert('Удалить не получилось');
            })
            this.categoryData = {};
            this.form_edit = false;
          },
          // method - create category
          add() {
            if (this.categoryData.name) {
              axios.post(this.appConfig.api_url + '/addCategory', {
                  name: this.categoryData.name,
                  description: this.categoryData.description,
                  parent_name: this.categoryData.parent_name
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
              axios
                .put(this.appConfig.api_url + '/putCategory', {
                  id: this.categoryData.id,
                  name: this.categoryData.name,
                  description: this.categoryData.description,
                  parent_name: this.categoryData.parent_name,
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
          }
        }
      }
</script>
<style>
</style>
