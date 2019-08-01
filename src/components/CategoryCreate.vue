<template>
  <div class="col s12 m6">
    <div>            
      <div class="page-subtitle">
        <h4> {{ 'Create' | localize }} </h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input 
            id="name" 
            type="text" 
            v-model="title"
            :class="{invalid: $v.title.$dirty && !$v.title.required}"
          />
          <label for="name"> {{ 'Title' | localize }} </label>
          <span 
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >
            {{ 'Enter_Name_Category' | localize }}
          </span>
        </div>

        <div class="input-field">
          <input 
            id="limit" 
            type="number" 
            v-model.number="limit"
            :class="{invalid: $v.limit.$dirty && !$v.limit.minValue}"
          />
          <label for="limit"> {{ 'Limit' | localize }} </label>
          <span 
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
          >
            {{ 'Minimum_Value' | localize }} {{$v.limit.$params.minValue.min}}
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Create' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template> 

<script>
import {required, minValue} from 'vuelidate/lib/validators'


export default {
  data() {
    return {
      title: '',
      limit: 100
    }
  },
  validations: {
    title: {
      required: required
    },
    limit: {
      minValue: minValue(100) 
    }
  },
  mounted() { // жизненный цикл
    M.updateTextFields(); //чтобы при первой загрузке лебел видел что поле не пустой взято с оф. док. materialize
  },
  methods: {
    async submitHandler() { //отправка формы
      
      if(this.$v.$invalid) { //если форма не валидна
        this.$v.$touch()  //this.$v.$touch() при вызове события означает что мы запускаем процесс валидации только тогда когда запустили событие submit, то есть нажали на кнопку при этом $dirty в любом случае сразу станет true
        return
      }

      try {
        const category = await this.$store.dispatch('createCategory', {
          title: this.title,
          limit: this.limit
        }) // в const category попадет то что делает return dispatch('createCategory') в store/category.js, а именно return {title, limit, id: category.key}, то есть объект        
        
        this.title = ''
        this.limit = 100

        this.$v.$reset() //сбрасываем валидацию посте отправки данных
        this.$message('Категория создана') //наш плагин из utils/message.plugin.js

        this.$emit('created', category) //заэмитили событие и передали в него объект category
        
      } catch(e) {}      
    }
  }
}
</script>
