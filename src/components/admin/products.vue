<template>
  <div class="q-pa-md q-gutter-y-sm">
    <!-- header for this component-->
    <q-toolbar class="bg-grey-8 text-white shadow-2">
      <q-toolbar-title>Товары</q-toolbar-title>
      <q-input flat dark dense standout v-model="search_text" input-class="text-right" class="q-ml-md">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-space />
      <q-btn flat @click="form_add = true" label="Добавить" outline color="white" />
      <q-btn flat @click="edit_select" label="Изменить" outline color="white" />
      <div class="text-white q-gutter-xs">
        <q-btn @click="dialog_delete = true" class="gt-xs" size="12px"
               flat
               dense round
               icon="delete" />
      </div>
    </q-toolbar>

    <!-- products table -->
    <q-table
      class="my-sticky-header-table"
      :data="data_products"
      :columns="columns_products"
      row-key="name"
      :pagination.sync="pagination"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      flat
      bordered
    />
    <!-- dialog for delete submit -->
    <q-dialog v-model="dialog_delete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Удалить выбранное?</span>
        </q-card-section>
        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn flat label="Нет" color="primary" v-close-popup />
          <q-btn flat label="Да" color="primary"  @click="del" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- form for create product-->
    <q-dialog v-model="form_add">
      <q-card class="my-card" style="min-width: 700px">
        <div class="row">
          <div class="col-6">
        <q-card-section>
          <q-form  class="q-gutter-md">
            <q-input
              square
              filled
              v-model="productData.name"
              label="Название товара"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
            />
            <q-input
              square
              outlined
              v-model="productData.model"
              label="Модель"
            />
            <q-input
              type = 'textarea'
              square
              outlined
              v-model="productData.description"
              label="Описание"
            />
            <q-select v-model="category_select" :options="category_names" label="категория" />
            <q-select v-model="company_select" :options="company_names" label="компания" />
            <q-input
              filled
              v-model="productData.price"
              prefix="$"
              square
              mask="#.##"
              reverse-fill-mask
              input-class="text-right"
              label="Цена"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
            />
            <q-input
              filled
              v-model="productData.count"
              square
              mask="##"
              reverse-fill-mask
              input-class="text-right"
              label="Количество"
            />
            <q-toggle
              v-model="productData.availability"
              color="green"
              keep-color
              label="Доступен"
            />
            <q-input
              @input="val => { productData.images = val[0] }"
              filled
              type="file"
            />
            <div>
              <q-btn @click="add" label="Добавить" type="submit" color="primary"/>
              <q-btn @click="productData = {}" label="Сброс" type="reset" color="primary" flat
                     class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
          </div>
        <div class="col-6">

        <q-card-section>
              <q-uploader
                label="Фото товара (общий объем не более 3Мб)"
                auto-upload
                :factory="factoryFn"
                :max-total-size="3145728"
                multiple
                batch
                square
                flat
                bordered
                style="max-height: 800px"
              />
        </q-card-section>
        </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- form for edit product -->
    <q-dialog v-model="form_edit">
      <q-card style="min-width: 400px">
        <q-bar  class="bg-positive text-white">
          <div>Редактировать компанию</div>
          <q-space />
          <q-btn dense flat icon="close" @click="productData={}" v-close-popup ></q-btn>
        </q-bar>
        <q-card-section class="row items-center">
          <q-form  class="q-gutter-md">
            <q-input
              square
              filled
              v-model="productData.name"
              label="Название компании"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
              style="min-width: 370px"
            />
            <q-input
              type = 'textarea'
              square
              outlined
              v-model="productData.description"
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
    name: 'Products',
    data() {
      return {
        productData: {},
        products: null,
        categories: null,
        companies: null,
        dialog_delete: false,
        form_add: false,
        form_edit: false,
        form_photo: false,
        selected: [],
        category_select: '',
        company_select: '',
        search_text: '',
        columns_products: [
          {
            name: 'name',
            required: true,
            label: 'Наименование',
            align: 'left',
            field: row => row.name,
            sortable: true
          },
          {name: 'model', align: 'left', label: 'Модель', field: 'model'},
          {name: 'price', label: 'Цена(руб.)', field: 'price', sortable: true},
          {name: 'count', label: 'Количество(шт.)', field: 'count', sortable: true},
          {name: 'availability', label: 'Доступность', field: 'availability', sortable: true}
        ],
        pagination: {
          sortBy: 'name',
          descending: false,
          page: 0,
          rowsPerPage: 0
        },
      }
    },
    computed: {
      //фильтруем список товаров по заданному слову из строки поиска
      data_products: function () {
        if (this.products) {
          if (!this.search_text) return this.products;
          else {
            let data = [];
            for (let product of this.products) {
              let name = product.name.toLowerCase();
              if (name.indexOf(this.search_text.toLowerCase()) !== -1) {
                data.push(product);
              }
            }
            return data;
          }
        }
      },
      //получаем список имен категорий для форм добавления и изменения товара
      category_names: function () {
        if (this.categories) {
          let names = [];
          for (let category of this.categories) {
            names.push(category.name);
          }
          return names;
        }
      },
      //получаем список имен компаний для форм добавления и изменения товара
      company_names: function () {
        if (this.companies) {
          let names = [];
          for (let company of this.companies) {
            names.push(company.name);
          }
          return names;
        }
      },
      CategoryId: function () {
        for (let category of this.categories) {
          if (category.name == this.category_select) return category.id;
        }
      },
      CompanyId: function () {
        for (let company of this.companies) {
          if (company.name == this.company_select) return company.id;
        }
      }
    },
    //при открытии страницы загружаем с сервера список Товаров, Категорий, Компаний
    mounted() {
      axios
        .get(this.appConfig.api_url + '/getProduct')
        .then(response => (this.products = response.data));
      axios
        .get(this.appConfig.api_url + '/getCompany')
        .then(response => (this.companies = response.data));
      axios
        .get(this.appConfig.api_url + '/getCategory')
        .then(response => (this.categories = response.data));
    },
    methods: {
      //метод получения списка товаров от сервера
      get_products() {
        axios
          .get(this.appConfig.api_url + '/getProduct')
          .then(response => (this.products = response.data));
      },
      // получение списка выбранных строк из таблицы
      getSelectedString() {
        return this.selected.length === 0 ? '' :
          `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.selected.length}`
      },
      //метод - удаление товаров
      del() {
        if (this.selected.length == 0) {
          alert('Ничего не выбрано');
          return;
        }
        console.log(this.selected[0].id);
        for (let i = 0; i < this.selected.length; i++) {
          axios
            .delete(this.appConfig.api_url + '/delProduct', {
                params: {
                  id: this.selected[i].id
                }
              }
            ).then((res) => {
            console.log('Ответ сервера:', res);
            if (res.status == 204) this.get_products();
          }).catch(function (err) {
            alert('Удалить не получилось');
          })
        }
        this.selected = [];
      },
      // метод добавления товара c фото
      add() {
        if (this.productData.name) {
          //добавляем в передаваемые данные Категорию и Компанию
          this.productData.CategoryId = this.CategoryId;
          this.productData.CompanyId = this.CompanyId;
          //формируем объект bodyFormData для передачи с помощью axios
          // формы с файлом в кодировке multipart/formdata
          var bodyFormData = new FormData();
          for(let key in this.productData){
            bodyFormData.append(key, this.productData[key]);
          }
          // отправляем сформированную форму, не забыв установить заголовок
          // Content-Type в multipart/formdata и добавить разделитель boundary
          axios.post(this.appConfig.api_url + '/addProduct',
            bodyFormData,
            { headers: { 'Content-Type': 'multipart/formdata; boundary=${bodyFormData._boundary}' } }
          ).then((res) => {
            console.log('Ответ сервера:', res);
            if (res.status == 200) {
              this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'fas fa-check-circle',
                message: 'Добавлено'
              });
              this.get_products();
            }
          })
            .catch(function (err) {
              alert('Ошибка - объект не добавлен');
            });
          this.companyData = {};
        }
      },

      edit_select() {
        if (this.selected.length == 0) {
          alert('Выберете товар для изменения');
          return;
        }
        if (this.selected.length > 1) {
          alert('Выберете только один товар для изменения');
          return;
        }
        this.form_edit = true;
      },
      edit() {
        axios
          .put(this.appConfig.api_url + '/putCompany', {
            id: this.companyData.id,
            name: this.companyData.name,
            description: this.companyData.description
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
          });
        this.companyData = {};
        this.form_edit = false;
      },
      //функция обработчик для загрузки фотографий товаров на сервер
      factoryFn(files) {
        return new Promise((resolve) => {
          // simulating a delay of 2 seconds
          setTimeout(() => {
            resolve({
              url: this.appConfig.api_url + '/addImage',
              method: 'POST'
            })
          }, 3000)
        })
      }
    }
  }
</script>
<style lang="stylus">
  .my-sticky-header-table
    /* max height is important */
    .q-table__middle
      max-height 600px

    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th /* bg color is important for th; just specify one */
      background-color #c1f4cd

    thead tr:first-child th
      position sticky
      top 0
      opacity 1
      z-index 1
</style>
