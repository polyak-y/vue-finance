<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <!-- ================================= -->
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
      <!-- ================================= -->
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
      <!-- ================================= -->
      <div class="input-field">
        <input 
          id="name" 
          type="text" 
          :class="{invalid: $v.name.$dirty && !$v.name.required}" 
          v-model="name"
        >
        <label for="name">Имя</label>
        <small v-if="$v.name.$dirty && !$v.name.required" class="helper-text invalid">Введите имя</small>
      </div>
      <!-- ================================= -->
      <p>
        <label>
          <input type="checkbox" v-model="agree" />
          <span>С правилами согласен</span>
        </label>
        <small style="display: block" v-if="$v.agree.$dirty && !$v.agree.checked" class="helper-text invalid">Подтвердите своё согласие</small>

      </p>
    </div>

    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Зарегистрироваться
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Уже есть аккаунт?
        <router-link to="/login">Войти!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import {email, required, minLength} from 'vuelidate/lib/validators' // импортируем правила валидации из библиотеки vuelidate

export default {
  data() {
    return {
      email: '',
      password: '',
      name: '',
      agree: false
    }
  },
  metaInfo() { // метод из библиотеки vue-meta которую мы установили
    return {
      title: this.$title('Register')
    }    
  },
  validations: {
    email: {//названия должны совпадать с названиями модели в поле data
      email, required
    }, 
    password: {
      required,
      minLength: minLength(5)
    },
    name: {required},
    agree: {
      checked(v) { //написали собственный валидатор
        return !!v
      }
    }
  },
  methods: {
    async submitHandler() { //клик на кнопку зарегистрироваться
      if(this.$v.$invalid) {
        this.$v.$touch() //вызваем програмно валидацию
        return
      }

      const formData = {
        email: this.email,
        password: this.password,
        name: this.name
      }

      try {
        await this.$store.dispatch('register', formData)      
        this.$router.push('/')
      } catch (e) {}     
    }
  }
}
</script>