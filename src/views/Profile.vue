<template>
  <div>
    <div class="page-title">
      <h3>{{'ProfileTitle' | localize}}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input 
          id="description" 
          type="text" 
          v-model="name" 
          :class="{ invalid: $v.name.$dirty && !$v.name.required }"
        />
        <label for="description">{{'Name' | localize}}</label>
        <small v-if="$v.name.$dirty && !$v.name.required" class="helper-text invalid">{{ 'Message_EnterName' | localize }}</small>
      </div>

      <div class="switch">
        <label>           
          <input type="checkbox" v-model="isRULocale"/>          
          <span class="lever"></span>
          <span class="en">English</span> 
          <span class="ru">Русский</span>  
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Update' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import { setTimeout } from 'timers'
import { required } from 'vuelidate/lib/validators' // импортируем правила валидации из библиотеки vuelidate
import localizeFilter from '@/filters/localize.filter'


export default {
  data() {
    return {
      name: '',
      isRULocale: true,
    }
  },
  metaInfo() { // метод из библиотеки vue-meta которую мы установили
    return {
      title: this.$title('ProfileTitle')
    }    
  },
  validations: {
    name: {//названия должны совпадать с названиями модели в поле data
      required
    }    
  },
  computed: {
    ...mapGetters(['info']) //функция для получения геттеров
  },
  mounted(){
    this.name = this.info.name
    this.isRULocale = this.info.locale === 'ru-RU'

    setTimeout(() => {
      M.updateTextFields(); //чтобы при первой загрузке лебел видел что поле не пустой взято с оф. док. materialize
    }, 0)
  },
  
  methods: {
    ...mapActions(['updateInfo']), //метод upadeInfo  это наш диспатч для обновления личных данных из store|info.js, mapActions - служебная функция vuex для получения диспатчей
    async submitHandler() {
      if(this.$v.$invalid) { //если форма не валидна
        this.$v.$touch()  //this.$v.$touch() при вызове события означает что мы запускаем процесс валидации только тогда когда запустили событие submit, то есть нажали на кнопку при этом $dirty в любом случае сразу станет true
        return
      }     

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRULocale ? 'ru-RU' : 'en-US'
        }) // диспатч из store/info.js
      } catch(e) {}
    }
  }
}
</script>

<style lang="scss">

  .switch {
    margin-bottom: 2rem;

    label {
      display: inline-flex;
      align-items: center;
    }

    .en {
      color: green;
      order: -1;
    }

    input:checked ~ .ru {
      color: green;
    }

    input:checked ~ .en {
    color: #9e9e9e!important;
  }
  }
  
</style>


