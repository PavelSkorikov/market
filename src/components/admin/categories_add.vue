<template>
  <div class="q-pa-md">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form  class="q-gutter-md">
        <q-input
          square
          filled
          v-model="name"
          label="Категория"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
        />
        <q-select
          square
          outlined
          v-model="parent_name"
          :options="options"
          label="Родительская категория" />
        <q-input
          type = 'textarea'
          square
          outlined
          v-model="description"
          label="Описание"
        />

        <div>
          <q-btn @click="onSubmit" label="Добавить" type="submit" color="primary"/>
          <q-btn @click="onReset" label="Сброс" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>

    </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'Categories_add',
  data () {
    return {
      name: null,
      parent_name: null,
      description: null,
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
