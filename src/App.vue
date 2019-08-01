<template>
  <div id="app">   
    <component :is="layout"></component> <!-- is - показыает в какой компонент подгружаем -->       
  </div>
</template>

<script> 
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'empty') + '-layout' //this.$route.meta - берем из route.js, для того чтобы понимать в какой шаблон подгружаем роуты
      //в итоге мы вернем либо 'main-layout' либо 'empty-layout', то есть название компонентов которые мы тут подключили 
    }
  },
  components: {
    EmptyLayout: EmptyLayout,
    MainLayout: MainLayout
  }
}
</script>

<style lang="scss">
  @import '~materialize-css/dist/css/materialize.min.css'; //установили materialize через yarn и импортировали его ~ это означает что ищем в node modules
  @import 'assets/index.css'


</style>
