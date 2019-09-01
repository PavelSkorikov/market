<template>
  <div class="q-pa-md" align="center">
    <h4>Введите данные для регистрации</h4>
    <!-- форма входа пользователя -->
    <q-card style="max-width: 500px" align="center">
      <q-card-section>
        <q-form  class="q-gutter-md">
          <!-- поле ввода имени пользователя -->
          <q-input
            square
            filled type="text"
            v-model="userData.name"
            label="Имя"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Пожалуйста введите Ваше имя']">
            <template v-slot:before>
              <q-icon name="account_box" />
            </template>
          </q-input>
          <!-- поле ввода e-mail -->
          <q-input
            square
            filled type="email"
            v-model="userData.email"
            label="Адрес электронной почты"
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
            :rules="[val => !!val || 'Введите пароль']">
            <template v-slot:before>
              <q-icon name="vpn_key" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
            <!-- поле подтверждения пароля -->
          </q-input>
          <q-input
            v-model="confirm_password"
            label="Подтверждение пароля"
            filled
            :type="isPwd ? 'password' : 'text'"
            :rules="[ val => val && val == userData.password || 'Пароли не совпадают']">
            <template v-slot:before>
              <q-icon name="key" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div>
            <q-btn @click="register" label="РЕГИСТРАЦИЯ" type="submit" color="primary"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>

  export default {
    name: "Register",

    data() {
      return {
        localStorage: window.localStorage,
        dense: true,
        userData: {},
        isPwd: true,
        confirm_password: null
      }
    },

    methods: {

      // регистрация пользователя
      register() {
        if (this.userData.email && this.userData.password && this.userData.name) {
          this.$store.dispatch('register', this.userData)
            .then(() => {
              this.userData = {};
              this.$router.push('/')
            })
            .catch(err => console.log(err))
        }
      },
    }
  }
</script>

<style scoped>

</style>
