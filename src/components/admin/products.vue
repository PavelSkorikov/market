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
        <q-bar  class="bg-positive text-white">
          <div>Добавить товар</div>
          <q-space />
          <q-btn dense flat icon="close" @click="productData={}, category_select = null, company_select =
          null" v-close-popup></q-btn>
        </q-bar>
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
            <div>
              <q-btn @click="add" label="Добавить" type="submit" color="primary"/>
              <q-btn @click="productData = {}, category_select = null, company_select =
          null" label="Сброс" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
          </div>
          <!-- форма для загрузки изображений товаров на сервер -->
        <div class="col-6">
        <q-card-section>
              <q-uploader
                label="Фото товара (общий объем не более 3Мб)"
                :factory="factoryFn"
                @uploaded="uploadedFile"
                :max-total-size="3145728"
                accept=".jpg, image/*"
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
      <q-card class="my-card" style="min-width: 1050px">
        <q-bar  class="bg-positive text-white">
          <div>Изменить товар</div>
          <q-space />
          <q-btn dense flat icon="close" @click="productData={}, category_select = null, company_select =
          null, selected=[]" v-close-popup></q-btn>
        </q-bar>
        <div class="row">
          <div class="col-4">
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
                <div>
                  <q-btn @click="edit" label="Изменить" type="submit" color="primary"/>
                </div>
              </q-form>
            </q-card-section>
          </div>
          <div class="col-4">
            <q-item v-for="image in images" :key="image.id">
              <img :src="image.path" @click="imageEdit=true, imageSelect=image">
            </q-item>
          </div>
          <!-- форма для добавления изображений товара -->
          <div class="col-4">
            <q-card-section>
              <q-uploader
                label="Добавить фото"
                :factory="factoryFn"
                @uploaded="uploadedFile"
                :max-total-size="3145728"
                multiple
                batch
                square
                flat
                bordered
                style="max-height: 800px"/>
            </q-card-section>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- form for edit image product -->
    <q-dialog v-model="imageEdit">
      <q-card class="my-card" style="min-width: 1050px">
        <q-bar  class="bg-positive text-white">
          <div>Фото товара</div>
          <q-space />
          <q-btn dense flat icon="close" @click="imageSelect={}" v-close-popup></q-btn>
        </q-bar>
        <q-card-section>
        <img :src="imageSelect.path" style="width: 1020px">
        </q-card-section>
        <q-card-section>
          <q-btn @click="delImage" label="УДАЛИТЬ" type="submit" color="primary"/>
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
        images: {},
        products: null,
        categories: null,
        companies: null,
        imageSelect: {},
        dialog_delete: false,
        form_add: false,
        form_edit: false,
        form_photo: false,
        imageEdit: false,
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
          {name: 'category', label: 'Категория', field: 'CategoryId', sortable: true},
          {name: 'company', label: 'Компания', field: 'CompanyId', sortable: true},
          {name: 'price', label: 'Цена(руб.)', field: 'price', sortable: true},
          {name: 'count', label: 'Количество(шт.)', field: 'count', sortable: true},
          {name: 'availability', label: 'Доступность', field: 'availability', sortable: true},
          {name: 'date', label: 'Дата добавления', field: 'createdAt', sortable: true}
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

      // метод формирования списка товаров для вывода на экран
      data_products: function () {
        //если загружены с сервера данные по товарам, категориям и компаниям
        if (this.products && this.categories && this.companies) {
          //в списке товаров преобразуем полученный id категории в имя категории
          this.products.forEach((product) => {
            this.categories.forEach((category) => {
              if(category.id == product.CategoryId) product.CategoryId = category.name;
            })
          });
          //в списке товаров преобразуем полученный id компании в имя компании
          this.products.forEach((product) => {
            this.companies.forEach((company) => {
              if(company.id == product.CompanyId) product.CompanyId = company.name;
            })
          });
          //если в строке поиска ничего не набрано выводим список товаров как есть
          if (!this.search_text) return this.products;
          //иначе фильтруем список товаров по заданному слову из строки поиска
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

      //вычисляем id категории по выбранному из списка имени категории
      CategoryId: function () {
        for (let category of this.categories) {
          if (category.name == this.category_select) return category.id;
        }
      },

      //вычисляем id компании по выбранному из списка имени компании
      CompanyId: function () {
        for (let company of this.companies) {
          if (company.name == this.company_select) return company.id;
        }
      }
    },

    //при открытии страницы загружаем с сервера список Товаров, Категорий, Компаний
    mounted() {
      axios
        .get(this.appConfig.api_url + '/getCompany')
        .then(response => (this.companies = response.data));
      axios
        .get(this.appConfig.api_url + '/getCategory')
        .then(response => (this.categories = response.data));
      axios
        .get(this.appConfig.api_url + '/getProduct')
        .then(response => (this.products = response.data));

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

          axios.post(this.appConfig.api_url + '/addProduct',
            this.productData
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
          this.category_select = null;
          this.company_select = null;
        }
      },

      //метод заполнения данными формы для редактирования товара
      edit_select() {
        if (this.selected.length == 0) {
          alert('Выберете товар для изменения');
          return;
        }
        if (this.selected.length > 1) {
          alert('Выберете только один товар для изменения');
          return;
        }
        // заполняем форму данными выбранного товара
        // которые берем из объекта this.selected[0](отмеченный галочкой товар) таблицы товаров
        console.log(this.selected[0]);
        this.productData.id = this.selected[0].id;
        console.log(this.productData.id);
        this.productData.name = this.selected[0].name;
        this.productData.model = this.selected[0].model;
        this.productData.description = this.selected[0].description;
        // вычисляем имя категории и компании товара по id категории и компании
        for (let category of this.categories) {
          if(category.id == this.selected[0].CategoryId){
            this.category_select = category.name;
          }
        }
        for (let company of this.companies) {
          if(company.id == this.selected[0].CompanyId){
            this.company_select = company.name;
          }
        }
        // количество и цену преобразуем в строку поскольку маски данных полей
        // требуют строковые данные
        this.productData.count = this.selected[0].count.toString();
        this.productData.price = this.selected[0].price.toString();
        this.productData.availability = this.selected[0].availability;
        // скачиваем с сервера пути к фотографиям товара по id товара
        axios
          .get(this.appConfig.api_url + '/getImage', {
            params: {
              id: this.productData.id
            }
          })
          .then(response => {
            this.images = response.data;
            console.log(this.images);
          });
        // наконец открываем форму с полученными данными товара
        this.form_edit = true;
      },

      //метод изменения товара
      edit() {
        if (this.productData.name) {
          //добавляем в передаваемые данные Категорию и Компанию
          this.productData.CategoryId = this.CategoryId;
          this.productData.CompanyId = this.CompanyId;
          axios
            .put(this.appConfig.api_url + '/putProduct', this.productData)
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
            this.get_products();
          })
            .catch(function (err) {
              alert('Ошибка - объект не изменен');
            });
          this.selected = [];
          this.form_edit = false;
        }
      },

      //метод для удаления изображения товара, как файла, так и записи в базе Image
      delImage(){
        if(this.imageSelect){
          axios
            .delete(this.appConfig.api_url + '/delImage', {
                params: {
                  id: this.imageSelect.id,
                  path: this.imageSelect.path
                }
              }
            ).then((res) => {
            console.log('Ответ сервера:', res);
            if (res.status == 204) {
              this.edit_select();
              this.imageEdit = false;
            }
          }).catch(function (err) {
            alert('Удалить не получилось');
          })
        }
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
      },

      //функция обработчик ответа сервера после загрузки файлов(фото товара)
      uploadedFile(info) {
        console.log(info.xhr.response);
        this.productData.files = JSON.parse(info.xhr.response);
      },
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
