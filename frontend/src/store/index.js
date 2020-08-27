import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginData: sessionStorage.getItem("id") ? sessionStorage.getItem("id") : false
  },
  mutations: {
    SET_LOGIN_DATA(state, data){
      state.loginData = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
