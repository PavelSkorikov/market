<template>
  <div class="q-pa-md">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form  class="q-gutter-md">
        <q-input
          square
          filled type="email"
          v-model="email"
          label="e-mail"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']"
        />

        <q-input
          square
          v-model="password"
          label="password"
          filled :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          square
          filled
          v-model="discount"
          label="Скидка"
          placeholder="%"
          mask="##"
        />
      </q-form>
    </div>
      <div>

          <q-btn @click="onSubmit" label="Добавить" type="submit" color="primary"/>
          <q-btn @click="onReset" label="Сброс" type="reset" color="primary" flat class="q-ml-sm" />
  </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'Users_add',
  data() {
    return {
      password: '',
      isPwd: true,

      email: '',
      discount: '',
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
      this.email = null;
      this.password = null;
      this.discount = null;
    }
  }
}
</script>
