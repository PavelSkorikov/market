<template>
  <div class="q-pa-md" align="center">
    <h4>Введите данные для входа</h4>
  <!-- форма входа пользователя -->
    <q-card style="max-width: 500px" align="center">
      <q-card-section>
        <q-form  class="q-gutter-md">
          <!-- поле ввода e-mail -->
          <q-input
            square
            filled type="email"
            v-model="userData.email"
            label="E-mail"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']">
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
            :rules="[ val => val && val.length > 0 || 'Пожалуйста введите что нибудь']">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div>
            <q-btn @click="login" label="ВХОД" type="submit" color="primary"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>

	export default {
    name: "Login",

    data() {
      return {
        localStorage: window.localStorage,
        dense: true,
        userData: {},
        isPwd: true,
      }
    },

    methods: {

      // логин пользователя
      login() {
        if (this.userData.email && this.userData.password) {
          // отправляем email и пароль пользователя на сервер для аутентификации
          this.$axios.post(this.appConfig.auth_url + '/login',
            this.userData
          ).then((res) => {
            // при успешной аутентификации получаем с сервера jwt токен и refreshtoken
            this.localStorage.token = res.data.token;
            this.localStorage.refreshtoken = res.data.refreshtoken;
            this.localStorage.name = res.data.name;
            this.localStorage.group = res.data.group;
            this.userData = {};
            this.$router.push('/');
          })
            .catch(function (err) {
              alert('e-mail или пароль неверен, поробуйте еще раз');
            });
          this.userData = {};
        }
      },
    }
  }
</script>

<style scoped>

</style>
