<template>
  <div>
    <div class="page-title">
      <h3> {{ 'Menu_NewRecord' | localize }} </h3>
    </div>

    <Loader v-if="loading" />

    <h5 class="center" v-else-if="!categories.length"> {{ 'No_Categories' | localize }} <router-link to="/categories"> {{ 'Add_Category' | localize }} </router-link></h5>

    <form v-else class="form" @submit.prevent="handelSubmit">
      <div class="input-field">
        <!-- ====================select============== -->
        <select ref="select" v-model="selectCat">
          <option 
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >{{cat.title}}</option>
        </select>
        <label> {{ 'Selected_Category' | localize }} </label>
      </div>
      <!-- ==================== radioButton ==================== -->
      <p>
        <label>
          <input 
            class="with-gap" 
            name="type" 
            type="radio" 
            value="income"
            v-model="typeRadioButton" 
          />
          <span> {{ 'Table_Income' | localize }} </span>
        </label>
      </p>

      <p>
        <label>
          <input 
            class="with-gap" 
            name="type" 
            type="radio" 
            value="outcome" 
            v-model="typeRadioButton"
          />
          <span> {{ 'Table_Expense' | localize }} </span>
        </label>
      </p>
    <!-- ========input number================== -->
      <div class="input-field">
        <input 
          id="amount" 
          type="number"
          v-model.number='amount'
          :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
        >
        <label for="amount"> {{ 'Amount' | localize }} </label>
        <span 
            class="helper-text invalid"
            v-if="$v.amount.$dirty && !$v.amount.minValue"
          >
            {{ 'Minimum_Value' | localize }} {{$v.amount.$params.minValue.min}}
          </span>
      </div>
      <!-- ========input description================== -->
      <div class="input-field">
        <input 
          id="description" 
          type="text"
          v-model="description"
          :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description"> {{ 'Description' | localize }} </label>
        <span 
            class="helper-text invalid"
            v-if="$v.description.$dirty && !$v.description.required"
          >
            {{ 'Enter_Description' | localize }}
          </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ 'Create' | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>  
  </div>
  
</template>

<script>
  import {required, minValue} from 'vuelidate/lib/validators'
  import {mapGetters} from 'vuex' //функция для получения геттеров из vuex


  export default {
    name: 'MyRecord',
    data(){
      return {
        loading: true,
        categories: [],
        selectCat: null, //для выпадающего списка
        select: null, //для удаления инициализации плагина  выпадающего списка materialize
        typeRadioButton: 'outcome', //для радиокнопок
        amount: 1,
        description: ''
      }
    },
    metaInfo() { // метод из библиотеки vue-meta которую мы установили
      return {
        title: this.$title('Menu_NewRecord')
      }    
    },
    validations: {
      amount: {
        minValue: minValue(1)
      },
      description: {
        required: required 
      }
    },
    async mounted(){

      this.categories = await this.$store.dispatch('fetchCategories') //получение всех категорий. Диспатч вызывается в store/category.js
      this.loading = false

      if(this.categories.length) {
        this.selectCat = this.categories[0].id
      }

      setTimeout(()=>{
        this.select = M.FormSelect.init(this.$refs.select); //инициализировали плагин селекта в materialize.css
        M.updateTextFields(); //чтобы при первой загрузке лебел видел что поле не пустой взято с оф. док. materialize
      },0)
    },
    computed: {
      ...mapGetters(['info']),//использовали функцию mapGetters и через спред оператор(...) получили геттерс info, который находится в store/info.js
      
      canCreateRecord(){ 
        
        if(this.typeRadioButton === 'income') { //если доход, то возвращаем true
          return true
        }

        return this.info.bill >= this.amount //this.info.bill получен от сюда ...mapGetters(['info'])
      }
    },
    methods: {
      async handelSubmit(){ //отправка формы
        if(this.$v.$invalid){
          this.$v.$touch()
          return
        }

        if(this.canCreateRecord) {
          try {
            await this.$store.dispatch('createRecord', { // этот диспатч реализован в store/record.js
              categoryId: this.selectCat,
              amount: this.amount,
              description: this.description,
              type: this.typeRadioButton,
              date:new Date().toJSON()
            })

            const bill = this.typeRadioButton === 'income'
              ? this.info.bill + this.amount
              : this.info.bill - this.amount
            
            await this.$store.dispatch('updateInfo', {bill}) // этот диспатч реализован в store/info.js

            this.$message("Запись успешно создана!")
            this.$v.$reset()
            this.amount = 1
            this.description = ''

          } catch(e){
            console.log(e)
          }
         
        } else {
          this.$message(`Недостаточно средств на счёте (${(this.amount - this.info.bill).toLocaleString('ru-RU')})`)
        }

        
      }
    }
    
  }
</script>
