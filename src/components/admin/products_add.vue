<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-5">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form  class="q-gutter-md">
        <q-input
          square
          filled
          v-model="name"
          label="Название товара"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
        />
        <q-input
          square
          filled
          v-model="model"
          label="Модель"
        />
        <q-select
          square
          outlined
          v-model="category"
          :options="options"
          label="Категория" />
        <q-select
          square
          outlined
          v-model="company"
          :options="options"
          label="Компания производитель" />
        <q-input
          type = 'textarea'
          square
          outlined
          v-model="description"
          label="Описание"
        />
          <q-input
            filled
            square
            v-model="price"
            label="Цена"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            input-class="text-right"
          />
          <q-input
            filled
            square
            v-model="count"
            label="Количество"
            mask="#"
            fill-mask="0"
            reverse-fill-mask
            input-class="text-right"
          />
        <div>
          <q-btn @click="onSubmit" label="Добавить" type="submit" color="primary"/>
          <q-btn @click="onReset" label="Сброс" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
      </div>
      <div class="col-7">
        <q-form>
          <div class="q-gutter-md row items-start">
            <div class="q-pa-md">
            <q-input
              @input="val => { files = val }"
              multiple
              filled
              type="file"
              hint="Выберите фото товара"
            />
          <br>
          <q-btn @click="onSubmit" label="Прикрепить фото" type="submit" color="primary"/>
          <q-btn @click="onReset" label="Сброс" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
          </div>
        </q-form>
      </div>
  </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'Products_add',
  data () {
    return {
      name: null,
      description: null,
      model: null,
      price: null,
      count: null,
      company: null,
      category: null
    }
  },

  methods: {
    onSubmit () {
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: 'Отправлено'
      })
    },
    onReset () {
      this.name = null;
      this.description = null;
    }
  }
}
</script>
