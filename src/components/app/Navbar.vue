<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">

      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('clickNav')"> <!-- передали клик в MainLayout.vue -->
          <i class="material-icons black-text">dehaze</i>
        </a>
        <span class="black-text">{{date | dateFilter('datetime') }}</span> <!-- dateFilter это наш фильтр который мы зарегистрировали глобально в main.js, в скобках передаем опции -->
      </div>

      <ul class="right hide-on-small-and-down">
        <li>
          <a class="dropdown-trigger black-text" href="#" data-target="dropdown" ref="dropdown">
            {{name}}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content">
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i> {{ 'ProfileTitle' | localize }}
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i> {{ 'Logout' | localize }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { setInterval, clearInterval } from 'timers';

export default {
  data() {
    return {
      date: new Date(),
      interval: null,
      dropdown: null
    }
  },  
  computed: {
    name() {
      return this.$store.getters.info.name
    }
  },
  methods: {
    async logout() { //метод по клику на кнопку выйти
      await this.$store.dispatch('logout') // экшн для очистки данных в firebase. Используется в auth.js в папке store
      this.$router.push('/login?message=logout') //програмный роут ?message=logout - используем в Login.vue
    } 
  },
  mounted() { //жизненный цикл компонента  
    this.interval = setInterval(() => {
      this.date = new Date()
    },1000)

    this.dropdown =  M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: false
    })
  },
  beforeDestroy() { //жизненный цикл. При размонтировании элемента мы очищаем то что сделаи в mounted
    clearInterval(this.interval) //очищаем интервал
    if(this.dropdown && this.dropdown.destroy) {
      this.dropdown.destroy()
    }
  }
 
}
</script>
