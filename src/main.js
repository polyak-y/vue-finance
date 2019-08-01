import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import VueMeta from 'vue-meta' // для мета данных библиотека, в данном случае используем для установления title


import App from './App.vue'
import router from './router'
import store from '@/store'
import dateFilter from '@/filters/date.filter' //импортировали функцию фильтр
import currencyFilter from '@/filters/currency.filter' //импортировали функцию фильтр
import localizeFilter from '@/filters/localize.filter' //импортировали функцию фильтр
import tooltipDirective from '@/directives/tooltip.directive' //наша директива

import messagePlugin from '@/utils/message.plugin' //импортировали плагин который мы сами создали
import titlePlugin from '@/utils/title.plugin' //импортировали плагин который мы сами создали


import Loader from '@/components/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min.js'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false


Vue.use(messagePlugin) //подключили наш плагин. Обращаться к его методам можно так: this.$message, this.$error. Используем в Login.vue
Vue.use(titlePlugin) //подключили наш плагин. Обращаться к его методам можно так: this.$title Используем во всех вьюхах для отображения title

Vue.use(Vuelidate)
Vue.use(VueMeta)

Vue.filter('dateFilter', dateFilter) //зарегистрировали фильтр глобально. Испольлзовали в Navbar.vue
Vue.filter('currencyFilter', currencyFilter) //зарегистрировали фильтр глобально. Испольлзовали в HomeBill.vue
Vue.filter('localize', localizeFilter) //зарегистрировали фильтр глобально. Испольлзовали для перевода всех слов на английский язык
Vue.directive('tooltip', tooltipDirective ) //зарегистрировали глобально директиву. Первый параметр это название директивы, второй то что импортировали

Vue.component('Loader', Loader) //зарегистрировали компонент Лоадера глобально
Vue.component('appPaginate', Paginate) //зарегистрировали компонент пагинации (который мы установили через npm) глобально


var firebaseConfig = { //конфигурация взятая из firebase для наешего приложения
  apiKey: "AIzaSyClUZnvOEgUx1xxzK6Z3ldM3xQsHAlPGdk",
  authDomain: "vue-finans.firebaseapp.com",
  databaseURL: "https://vue-finans.firebaseio.com",
  projectId: "vue-finans",
  storageBucket: "",
  messagingSenderId: "900386932912",
  appId: "1:900386932912:web:82b337be14e008a7"
};
firebase.initializeApp(firebaseConfig)

let app

firebase.auth().onAuthStateChanged(() => { // Firebase находит данные пользователя, и только после этого мы рисуем приложение. При этом не важно, найдет он эти данные, или нет. Он в любом случае, когда будет готов, вызовет onAuthStateChanged после чего мы в любом случае отрисуем приложение

  if(!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App) 
    }).$mount('#app')
  }  

}) //данный метод вызывается в случае когда firebase найдет локальные данные пользователя которые позволят поддерживать автоматическую авторизацию, либо ничего не найдет


