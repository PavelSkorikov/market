<template>
  <div class="q-pa-md">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form>
        <q-input
          filled
          v-model="name"
          label="Название компании"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
        />
        <q-input
          v-model="description"
          label="Описание"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
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
  name: 'Companies_add',
  data () {
    return {
      name: null,
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
