import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [   
    {
      path: '/login',
      name: 'login', 
      meta: {layout: 'empty'}, //{layout: 'empty'} - названия произвольные, у нас два шаблона в папке layouts(EmptyLayout и  MainLayout) в каждом из них есть <router-view/>. meta указывает в какой шаблон будем подгружать наши вьюшки. Используется в App.vue
      component: () => import('./views/Login.vue') //lazy loading
    },
    {
      path: '/register',
      name: 'register',
      meta: {layout: 'empty', auth: true},
      component: () => import('./views/Register.vue')
    },
    {
      path: '/',
      name: 'home',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Home.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Categories.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/history',
      name: 'history',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/History.vue')
    },
    {
      path: '/planning',
      name: 'planning',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Planning.vue')
    },
    {
      path: '/record',
      name: 'record',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Record.vue')
    },
    {
      path: '/detail/:id',
      name: 'detail',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Detail.vue')
    } 
  ]
})


router.beforeEach((to, from, next) => { //для защиты роутов, срабатывает только при переходе на роут, to - роут куда идем,  from - откдуа идем,  next - функция для запрети или разрешения роута
  const currentUser = firebase.auth().currentUser //метод firebase проверяет зареген ли сейчас юзер
  const requireAuth = to.matched.some(record => record.meta.auth) 
  
  if(requireAuth && !currentUser) { //переходим на роут и если auth у роута true, но юзера нет  null  
    next('/login?message=login')
  } else {
    next()
  }
}) //метод вызывается при смене роута, в нашем случае для защиты роута


export default router