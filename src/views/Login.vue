<template>
  <form class="card auth-card" @submit.prevent="submitHandler">    
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <!-- =========================email========================== -->
      <div class="input-field">
        <input 
          id="email" 
          type="text" 
          v-model.trim="email"
          :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
        >     
        <!-- $dirty (грязный) - вводили ли мы что нибудь в поле -->  
        <label for="email">Email</label>
        <small v-if="$v.email.$dirty && !$v.email.required" class="helper-text invalid">Поле email не должно быть пустым</small>
        <small v-else-if="$v.email.$dirty && !$v.email.email" class="helper-text invalid">Введите корректный email</small>
      </div>
      <!-- =========================password========================== -->
      <div class="input-field">
        <input 
          id="password" 
          type="password" 
          :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
          v-model.trim="password"
        >
        <label for="password">Пароль</label>
        <small v-if="$v.password.$dirty && !$v.password.required" class="helper-text invalid">Поле пароля не должно быть пустым</small>
        <small v-else-if="$v.password.$dirty && !$v.password.minLength" class="helper-text invalid">Пароль не должен быть менее {{$v.password.$params.minLength.min}} символов</small>
      </div>
    </div>

    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Войти
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import {email, required, minLength} from 'vuelidate/lib/validators' // импортируем правила валидации из библиотеки vuelidate
import messages from '@/utils/messages.js'

export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  metaInfo() { // метод из библиотеки vue-meta которую мы установили
    return {
      title: this.$title('Login')
    }    
  },
  validations: {
    email: {//названия должны совпадать с названиями модели в поле data
      email, required
    }, 
    password: {
      required,
      minLength: minLength(7)
    }
  },
  mounted() { //жизненный цикл
    //this.$route.query.message - query параметр из строки браузера
    if(messages[this.$route.query.message]) { //messages[this.$route.query.message] - наше сообщение из объекта message который мы импортировали
      this.$message(messages[this.$route.query.message])
    }
    
    
  },
  methods: {
    async submitHandler() {
      if(this.$v.$invalid) { //если форма не валидна
        this.$v.$touch()  //this.$v.$touch() при вызове события означает что мы запускаем процесс валидации только тогда когда запустили событие submit, то есть нажали на кнопку при этом $dirty в любом случае сразу станет true
        return
      }

      const formData = {
        email: this.email,
        password: this.password
      }

      try {
        await this.$store.dispatch('login', formData)
        this.$router.push('/')
      } catch (e) {}

    }
  }
}
</script>