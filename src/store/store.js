import Vue from 'vue';
import Vuex from 'vuex';
//импортируем библиотеку для декодировнаия jwt
import jwt_decode from 'jwt-decode';

import axios from 'axios'
const config = require('../config');

Vue.use(Vuex);

export const store = new Vuex.Store({

  state: {
    status: '',
    token: sessionStorage.getItem('token') || '',
    refreshtoken: sessionStorage.getItem('refreshtoken') || '',
    user: {
      name: sessionStorage.getItem('name') || '',
      group: sessionStorage.getItem('group') || '',
      status: sessionStorage.getItem('status') || '',
      discount: sessionStorage.getItem('discount') || '',

    }
  },

  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_token(state, token){
      state.status = 'download_token';
      state.token = token;
    },
    auth_success(state, user){
      state.status = 'success';
      state.user = user
    },
    auth_error(state, err){
      state.status = 'error';
      console.log(err);
      // если ошибка очищаем хранилище и удаляем токен из заголовка авторизации
      sessionStorage.clear();
      delete axios.defaults.headers.common['Authorization'];
    },
    logout(state){
      state.status = '';
      state.token = '';
      state.refreshtoken = '';
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
          // сохраняем полученный токен и refreshtoken в хранилище sessionStorage
          const token = 'Bearer ' + res.data.token;
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('refreshtoken', res.data.refreshtoken);
          // сохраняем состояние токена
          commit('auth_token', token);
          // записываем полученный токен в заголовок авторизации для всех запросов axios
          axios.defaults.headers.common['Authorization'] = token;
          // декодируем из токена id пользователя
          const decoded = jwt_decode(token);
          // запрашиваем данные пользователя с полученным id
          axios.get(config.admin_url + '/getUser', {
            params: {id: decoded.id}
          }).then(res =>{
            // сохраняем данные пользователя в хранилище
            for(let key in res.data){
              sessionStorage.setItem(key, res.data[key]);
            }
            commit('auth_success', res.data);
          }).catch(err => {
            commit('auth_error', err);
          });
        })
        .catch(err => {
          commit('auth_error', err);
        })
    },

    // метод регистрации пользователя
    register: ({commit}, user) => {
        commit('auth_request');
        axios.post(config.auth_url + '/register', user)
          .then(res => {
            // сохраняем полученный токен и refreshtoken в хранилище sessionStorage
            const token = 'Bearer ' + res.data.token;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('refreshtoken', res.data.refreshtoken);
            // сохраняем состояние токена
            commit('auth_token', token);
            // записываем полученный токен в заголовок авторизации для всех запросов axios
            axios.defaults.headers.common['Authorization'] = token;
            // декодируем из токена id пользователя
            const decoded = jwt_decode(token);
            // запрашиваем данные пользователя с полученным id
            axios.get(config.admin_url + '/getUser', {
              params: {id: decoded.id}
            }).then(res =>{
              // сохраняем данные пользователя в хранилище
              for(let key in res.data){
                sessionStorage.setItem(key, res.data[key]);
              }
              commit('auth_success', res.data);
            }).catch(err => {
              commit('auth_error', err);
            });
          })
          .catch(err => {
            commit('auth_error', err);
          })
    },

    //метод выхода пользователя
    logout: ({commit}) => {
      // отправляем запрос на сервер для удаления refreshtoken
      if (sessionStorage.token) {
        const id = jwt_decode(sessionStorage.token).id;
        axios.post(config.auth_url + '/logout', {
          id: id
        });
      }
        // очищаем состояние Vuex
        commit('logout');
        // очищаем хранилище и удаляем токен из заголовка авторизации axios
        sessionStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
    },

    //метод обновления токена в сучае истечения его времени жизни
    refreshToken: ({commit}) => {
      axios.post(config.auth_url + '/refresh', {
        refreshtoken: sessionStorage.refreshtoken
      })
        .then(res =>{
          // сохраняем новые токен и refreshtoken в хранилище sessionStorage
          const token = 'Bearer ' + res.data.token;
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('refreshtoken', res.data.refreshtoken);
          // сохраняем состояние токена
          commit('auth_token', token);
          // записываем полученный токен в заголовок авторизации для всех запросов axios
          axios.defaults.headers.common['Authorization'] = token;
        })
        .catch(err => {
          commit('auth_error', err);
        })
    }
    },

  getters: {
    isLoggedIn: state => {
      return !!state.token
    },
    isAdmin: state => {
      return state.user.group
    },
    userName: state => {
      return state.user.name
    }
  }
});

