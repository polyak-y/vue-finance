<template>
  <div>
    <Loader v-if="loading" />

    <div v-else class="app-main-layout">
      
      <app-navbar @clickNav="isOpen = !isOpen"></app-navbar> <!-- получили клик от компонента Navbar и поменяли локальную пременную isOpen -->
  
      <app-sidebar 
        v-model="isOpen"
        :key="locale"
      >
      </app-sidebar> <!-- сюда передали пропс через v-model. А в качестве пропса в компонент Sidebar будет vlaue -->
  
      <main class="app-content" :class="{'full': !isOpen}">
        <div class="app-page">       
         <router-view /> <!-- место где подключаются роуты -->
        </div>
      </main> 
      <div :key="this.locale + Math.random()" class="fixed-action-btn" v-tooltip:left="localizeFilter('New_Record')">
        <router-link class="btn-floating btn-large blue" to="/record">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/app/Navbar.vue'
import Sidebar from '@/components/app/Sidebar.vue'
import Loader from '@/components/app/Loader.vue'
import messages from '@/utils/messages'
import localizeFilter from '@/filters/localize.filter'


export default {
  name: 'main-layout',
  data() {
    return {
      isOpen: true, //открыт или закрыт левый сайдбар
      loading: true
    }
  },
  async mounted() { //жизненный цикл
    if(!Object.keys(this.$store.getters.info).length) { //если объект info в store/info.js пустой
      await this.$store.dispatch('fetchInfo') //получение данных о пользователе
    }

    this.loading = false
  },
  methods: {
    localizeFilter
  },
  computed: {
    error() {
      return this.$store.getters.error 
    },
    locale() {
      return this.$store.getters.info.locale
    }
  },
  watch: {
    error(fbError) { //следит за изменениями  error в computed, fbError - то что возвращает error в computed
      this.$error(messages[fbError.code] || 'Что-то пошло не так!') //this.$error - плагин который мы подключили глобально в main.js
    }
  },
  components: {
    appNavbar: Navbar,
    appSidebar: Sidebar,
    Loader: Loader
  }
}
</script>