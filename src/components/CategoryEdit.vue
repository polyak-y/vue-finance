<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4> {{ 'Edit' | localize }} </h4>
      </div>

      <form @submit.prevent="submitHandler">
        <!-- ==================select======================= -->
        <div class="input-field">
          <select ref="select" v-model="current">
            <option 
              v-for="cat of categories"
              :key="cat.id"
              :value="cat.id"
            >{{cat.title}}
            </option>
           
          </select>
          <label> {{ 'Selected_Category' | localize }} </label>
        </div>
        <!-- ===============input name =============================== -->
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
        <!-- ===============input limit=============================== -->
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
        <!-- =================button submit ============================= -->
        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Update' | localize }}
          <i class="material-icons right">send</i>
        </button>

      </form>
    </div>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'

export default {
  props: {
    categories: { //приходит из Categories.vue
      type: Array,
      required: true
    }
  },
  data(){
    return {
      select: null,
      title: '',
      limit: 100, 
      current: null //для селекта. Сюда попадает id выбранной категории
    }
  },
  methods: {
    async submitHandler(){ //отправка формы
      if(this.$v.$invalid){
        this.$v.$touch()
        return
      }

      try { 
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        }

        await this.$store.dispatch('updateCategory', categoryData) //экшн для обновления категории, вызываем в store/category
        this.$message('Категория успешно обновлена')
        this.$emit('updated', categoryData) // создали кастомное событие для обновления массива с категориями который находится в views/Categories.vue
      }catch(e){}
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
  watch: { //отслеживаем изменение переменных
    current(catId) { //отслеживаем изменение переменной current
      const ind = this.categories.findIndex(elem => elem.id === catId)
      const {title, limit} = this.categories[ind]
      this.title = title
      this.limit = limit
    }
  },
  created(){
    const {id, title, limit} = this.categories[0]
    this.current = id
    this.title = title
    this.limit = limit
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select);
    M.updateTextFields(); //чтобы при первой загрузке лебел видел что поле не пустой взято с оф. док. materialize
  },
  destroyed(){
    if(this.select && this.select.destroy) {
      this.select.destroy()
    }    
  }
}
</script>

