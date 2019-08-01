import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'
import category from './category'
import record from './record'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null //сведения об ошибках. Отслеживается кроме того в MainLayout.vue
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error= null
    }
  },
  actions: {
    async fetchCurrency() { //используем в  Home.vue, метод для получения валют 
      const res = await fetch(`https://api.openrates.io/latest?symbols=USD,RUB`) //это всё взято из fixer.io
      return await res.json()
    }
  },
  getters: {
    error: state => state.error
  },
  modules: {
    auth, 
    info,
    category,
    record
  } 
})
