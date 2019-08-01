<template>   
  <div>
    <div class="page-title">
      <h3> {{ 'Menu_Planning' | localize }} </h3>
      <h4>{{info.bill | currencyFilter('RUB')}}</h4>
    </div>

    <Loader v-if="loading" />

    <h5 class="center" v-else-if="!categories.length"> {{ 'No_Categories' | localize }} <router-link to="/categories"> {{ 'Add_Category' | localize }} </router-link></h5>


    <section v-else>
      <div v-for="cat of categories" :key="cat.id">
        <p>
          <strong>{{cat.title}}:</strong>
          {{cat.spend | currencyFilter}} из {{cat.limit | currencyFilter}}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <!-- tooltip- созданная нами и глобально зарегистрированная директива -->
          <div  
            class="determinate" 
            :class="[cat.progressColor]"         
            :style="{width: cat.progressPercent + '%'}"
           ></div>
        </div>
      </div>
    </section>
  </div>  
</template>

<script>
import {mapGetters} from 'vuex' //функция для получения геттеров из vuex
import currencyFilter from '@/filters/currency.filter' //импортировали фильтр для программного использования, для применения в html импортировать не надо, т.к. мы его зарегистрировали глобально
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'planing',
  data() {
    return {
      loading: true,
      categories: []
    }
  },
  metaInfo() { // метод из библиотеки vue-meta которую мы установили
    return {
      title: this.$title('Menu_Planning')
    }    
  },
  computed: {
    ...mapGetters(['info']),//использовали функцию mapGetters и через спред оператор(...) получили геттерс info, который находится в store/info.js

  },
  async mounted(){
    const records = await this.$store.dispatch('fetchRecords') //диспать вызывается в store/record.js для получеения сведений о движении доходов/расходов
    const categories = await this.$store.dispatch('fetchCategories') // получение всех категорий из базы данных по указанному пользователю

    this.categories = categories.map(cat => {
      const spend = records
        .filter(record => record.categoryId === cat.id) //отфильтровал записи по их категории
        .filter(record => record.type === 'outcome') //отфильтровали расходы
        .reduce((sum, elem) => {// подсчитали общую сумму расходов
          return sum += +elem.amount
        }, 0)

      const percent = spend * 100 / cat.limit
      const progressPercent = percent > 100 ? 100 : percent
      const progressColor = percent < 60 
        ? 'green'
        : percent < 100 
          ? 'yellow'
          : 'red'

      const tooltipValue = cat.limit - spend
      const tooltip = `${tooltipValue < 0 ? localizeFilter('Excess_By') : localizeFilter('Remained')} ${currencyFilter(Math.abs(tooltipValue))}`//использовали фильтр currencyFilter програмно

      return {
        ...cat,
        progressPercent: progressPercent,
        progressColor: progressColor, 
        spend: spend,    
        tooltip: tooltip   
      }
    })

    this.loading = false
 }
}
</script>