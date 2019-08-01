import firebase from 'firebase/app'

export default {
  actions: {
    async createRecord ({commit, dispatch}, record) {
      try {
        const  uid = await dispatch('getUid') //получили id нашего нового пользователя
        return await firebase.database().ref(`/users/${uid}/records`).push(record)
      } catch(e) {
        console.log(e)
        commit('setError', e) // эта мутация из store/index.js
        throw e
      }
    },


    async fetchRecords({dispatch, commit}) {
      try {
        const uid = await dispatch('getUid') //экшн из auth.js - получили id пользователя
        const fetchRecords = await firebase.database().ref(`/users/${uid}/records`).once('value') //получили данные из таблицы records определенного пользователя
        const records = fetchRecords.val() || {}

        return Object.keys(records).map((key) => {
          return ({...records[key], id: key})
        })
      } catch(e) {
        commit('setError', e)
        throw e
      }
    }, 


    async fetchRecordById({dispatch, commit}, id) { // для получения одной записи по ее id. Вызывается в Detail.vue
      try {
        const uid = await dispatch('getUid') //экшн из auth.js - получили id пользователя
        const fetchRecord = await firebase.database().ref(`/users/${uid}/records`).child(id).once('value') //получили данные из таблицы records определенного пользователя
        const record = fetchRecord.val() || {}

        return {
          ...record,
          id
        }
      } catch(e) {
        commit('setError', e)
        throw e
      }
    }
  }
}