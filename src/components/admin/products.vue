<template>
  <div class="q-pa-md">
    <!-- header for this component-->
    <q-toolbar class="bg-grey-8 text-white shadow-2">
      <q-toolbar-title>Товары</q-toolbar-title>
      <q-btn @click="form_add = true" label="Добавить" outline color="white" />
    </q-toolbar>

    <!-- products table -->
    <q-table
      :data="data_products"
      :columns="columns_products"
      row-key="name"
      :pagination.sync="pagination"
      hide-bottom
    />

    <!-- dialog for delete submit -->
    <q-dialog v-model="dialog_delete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Вы уверены, что хотите удалить компанию {{productData.name}}?</span>
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
      <q-card style="min-width: 400px">
        <q-bar  class="bg-positive text-white">
          <div>Добавить товар</div>
          <q-space />
          <q-btn dense flat icon="close" @click="productData={}" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="row items-center">
          <q-form  class="q-gutter-md">
            <q-input
              square
              filled
              v-model="productData.name"
              label="Название товара"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
              style="min-width: 370px"
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
            <q-input
              filled
              v-model="productData.price"
              prefix="$"
              square
              mask="#.##"
              reverse-fill-mask
              input-class="text-right"
              label="Цена"
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

            <div>
              <q-btn @click="add" label="Добавить" type="submit" color="primary"/>
              <q-btn @click="productData = {}" label="Сброс" type="reset" color="primary" flat
                     class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
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
        dialog_delete: false,
        form_add: false,
        form_edit: false,
        columns_products: [
          {
            name: 'name',
            required: true,
            label: 'Наименование',
            align: 'left',
            field: row => row.name,
            sortable: true
          },
          { name: 'model', align: 'left', label: 'Модель', field: 'model' },
          { name: 'price', label: 'Цена(руб.)', field: 'price', sortable: true },
          { name: 'count', label: 'Количество(шт.)', field: 'count', sortable: true },
          { name: 'availability', label: 'Доступность', field: 'availability', sortable: true  }
        ],
        pagination: {
          sortBy: 'name',
          descending: false,
          page: 1,
          rowsPerPage: 10
          // rowsNumber: xx if getting data from a server
        },
      }
    },
    computed: {
      data_products: function() {
        if(this.products){
          return this.products;
        }
      }
    },
    //при открытии компонента загружаем с сервера список Компаний
    mounted() {
      axios
        .get(this.appConfig.api_url+'/getProduct')
        .then(response => (this.products = response.data));
    },
    methods: {
      //метод получения списка компаний от сервера
      get_products() {
        axios
          .get(this.appConfig.api_url+'/getProduct')
          .then(response => (this.products = response.data));
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
        if(this.productData.name) {
          axios.post(this.appConfig.api_url+'/addProduct',
            this.productData
          ).then((res) => {
            console.log('Ответ сервера:', res);
            if(res.status == 200) {
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
        this.form_edit = false;
      }

    }

  }
</script>
<style>
</style>
