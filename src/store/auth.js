import firebase from 'firebase/app'


export default {
  actions: {
    async login({dispatch, commit}, payload) { // экшн для входа в приложение используем в Login.vue
      try {
        await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password) //метод firebase для входа      
      } catch(e) {
        commit('setError', e) // эта мутация из store/index.js
        throw e
      }
    },


    async register({dispatch, commit}, {email, password, name}) { //экшн для регистрации нового пользователя. Используем в Register.vue
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password) //метод firebase для создания пользователя   
        
        const  uid = await dispatch('getUid') //получили id нашего нового пользователя

        await firebase.database().ref(`/users/${uid}/info`).set({ // занесли в database id пользвателя и его данные
          bill: 100000,
          name: name
        }) 

      } catch(e) {
        commit('setError', e) // эта мутация из store/index.js      
        
        throw e
      }
    },

    getUid() { //метод для получения id зарегеного пользователя, используется в экшене register тут же
      const user = firebase.auth().currentUser
      return user ? user.uid : null
    },

    async logout({commit}) { //экшн для очистки данных используется в Navbar.vue
      await firebase.auth().signOut()  //метод для очистки данных
      commit('clearInfo') // при выходе из прложения очищаем данные о пользователе. Данный коммит реализован в store/info.js
    }
  }
}