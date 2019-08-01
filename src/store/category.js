import firebase from 'firebase/app'


export default {
  actions: {   
    async fetchCategories({commit, dispatch}) { // получение всех категорий из базы данных по указанному пользователю. Вызывается в Categories.vue В жизненном цикле mounted
      try {
        const uid = await dispatch('getUid') //экшн из auth.js - получили id пользователя
        const fetchCategories = await firebase.database().ref(`/users/${uid}/categories`).once('value') //получили данные из таблицы categories определенного пользователя
        const categories = fetchCategories.val() || {}
      
        return Object.entries(categories).map(([key,obg]) => {
          return ({
            title: obg.title,
            limit: obg.limit,
            id: key
          })
        })   
      } catch(e) {
        commit('setError', e)
      }       
    },


    async fetchCategoryById({commit, dispatch}, id) { // получение одной категории из базы данных по указанному id. Вызывается в Detail.vue В жизненном цикле mounted
      try {
        const uid = await dispatch('getUid') //экшн из auth.js - получили id пользователя
        const fetchCategory = await firebase.database().ref(`/users/${uid}/categories`).child(id).once('value') //получили данные из таблицы categories определенного пользователя
        const category = fetchCategory.val() || {}
      
        return  {
          ...category,
          id
        }
      } catch(e) {
        commit('setError', e)
      }       
    },





    async createCategory({commit, dispatch}, {title, limit}) { //диспатч для создания категории используем в CategoryCreate.vue      
      try {
        const uid = await dispatch('getUid') //экшн из auth.js - получили id пользователя
        const category = await firebase.database().ref(`/users/${uid}/categories`).push({title, limit}) //занесли в базу данных новую категорию
        return {title, limit, id: category.key}
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },



    async updateCategory({commit, dispatch}, {title, limit, id}){  //диспатч для обновления категории используем в CategoryEdit.vue 
      try {
        const uid = await dispatch('getUid') //экшн из auth.js - получили id пользователя
        await firebase.database().ref(`/users/${uid}/categories`).child(id).update({title, limit}) //обновляем определеную категорию по имеющемуся id
      } catch(e) {
        commit('setError', e)
        throw e
      }
    }



  }
}