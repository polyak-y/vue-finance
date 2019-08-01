import firebase from 'firebase/app'

export default {
  state: {
    info: {}
  },
  mutations: {
    setInfo(state, payload) {
      state.info = payload
    },
    clearInfo(state) {
      state.info = {}
    }
  },
  actions: {
    async updateInfo({dispatch, commit, getters}, toUpdate) { //используем в Record.vue, когда создаем новую запись то обновляем остаток общей суммы. Она у нас в поле users/info/bill
      try {
        const uid = await dispatch('getUid')
        const updateData = {...getters.info, ...toUpdate}
        await firebase.database().ref(`/users/${uid}/info`).update(updateData)
        commit('setInfo', updateData)
      } catch(e) {
        commit('setError', e)
        throw e
      }   
    },
    async fetchInfo({dispatch, commit}) { //при загрузке MainLayout.vue, получение данных о пользователе
      try {
        const uid = await dispatch('getUid')
        const infoFetch = await firebase.database().ref(`/users/${uid}/info`).once('value')
        const info = infoFetch.val()
        commit('setInfo', info)
      } catch(e) {
        commit('setError', e)
        throw e
      }      
    }
  },
  getters: {
    info: state => state.info
  }
}