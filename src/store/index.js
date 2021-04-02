import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

let store = new Vuex.Store({
  state: {
    snackbar: {
      status: '',
      message: '',
      timeout: -1,
      show: false
    }
  },
  mutations: {
    SET_SNACKBAR: (state, snackbar) => {
      state.snackbar = snackbar
    }
  },
  actions: {},
  getters: {
    GET_SHACKBAR_INFO(state) {
      return state.snackbar
    }
  }
})

export default store