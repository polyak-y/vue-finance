<template>
  <div class="grey darken-1 empty-layout">
    <router-view /> <!-- место где подключаются роуты -->
  </div>
</template>
<script>
import messages from '@/utils/messages'

export default {
  computed: {
    error() {
      return this.$store.getters.error 
    }
  },
  watch: {
    error(fbError) { //следит за изменениями  error в computed, fbError - то что возвращает error в computed
      this.$error(messages[fbError.code] || 'Что-то пошло не так!') //this.$error - плагин который мы подключили глобально в main.js
    }
  }
}
</script>