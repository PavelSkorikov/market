import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
const config = require('../config');

Vue.use(Vuex);

export const store = new Vuex.Store({

  state: {
    status: '',
    user: {
      name: sessionStorage.getItem('name') || '',
      group: sessionStorage.getItem('group') || '',
      token: sessionStorage.getItem('token') || '',
      refreshtoken: sessionStorage.getItem('refreshtoken') || ''
    }
  },

  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, user){
      state.status = 'success';
      state.user = user
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = '';
      state.user = {}
    },
  },

  actions: {
    // метод входа пользователя
    login: ({commit}, user) => {
      // изменяем статус на loading
      commit('auth_request');
      // отправляем на сервер логин и пароль пользователя
      axios.post(config.auth_url + '/login', user)
        .then(res => {
          // сохраняем полученные данные в хранилище sessionStorage
          // записываем полученный токен в заголовок авторизации для всех запросов axios
          const token = 'Bearer ' + res.data.token;
          for(let key in res.data){
            sessionStorage.setItem(key, res.data[key]);
          }
          axios.defaults.headers.common['Authorization'] = token;
          commit('auth_success', res.data);
        })
        .catch(function (err) {
          commit('auth_error');
          // если ошибка очищаем хранилище
          sessionStorage.clear();
        })
    },

    // метод регистрации пользователя
    register: ({commit}, user) => {
        commit('auth_request');
        axios.post(config.auth_url + '/register', user)
          .then(res => {
            const token = 'Bearer ' + res.data.token;
            for(let key in res.data){
              sessionStorage.setItem(key, res.data[key]);
            }
            axios.defaults.headers.common['Authorization'] = token;
            commit('auth_success', res.data);
          })
          .catch(err => {
            commit('auth_error', err);
            sessionStorage.clear();
          })
    },

    //метод выхода пользователя
    logout: ({commit}) => {
        commit('logout');
        // очищаем хранилище и удаляем токен из заголовка авторизации axios
        sessionStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
      }
    },

  getters: {
    isLoggedIn: state => {
      return !!state.user.token
    },
    isAdmin: state => {
      return state.user.group
    },
    userName: state => {
      return state.user.name
    }
  }
});

