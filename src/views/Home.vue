<template>
  <div>
    <div class="page-title">
      <h3>{{'Home_Account' | localize}}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <Loader v-if="loading"/>

    <div class="row" v-else>
      <app-home-bill
        :rates="currency.rates"
        :date="currency.date"
      ></app-home-bill>

      <app-home-currency
        :rates="currency.rates"
        :date="currency.date"
      ></app-home-currency>     
    </div>
  </div>
</template>

<script>
import HomeBill from '@/components/HomeBill'
import HomeCurrency from '@/components/HomeCurrency'


export default {
  name: 'home',
  data() {
    return {
      loading: true,
      currency: null
    }
  },
  metaInfo() { // метод из библиотеки vue-meta которую мы установили
    return {
      title: this.$title('Menu_Bill')
    }    
  },
  async mounted() { //жизненный цикл компонента
    this.currency = await this.$store.dispatch('fetchCurrency') //экшн находится в store/index.js, возвращает нам объект с данными где есть свойство rates c валютами, date c актуальной датой и т.п.
    this.currency.rates['EUR'] = 1
    this.loading = false
  },
  methods: {
    async refresh() {
      this.loading = true
      this.currency = await this.$store.dispatch('fetchCurrency') //экшн находится в store/index.js, возвращает нам объект с данными где есть свойство rates c валютами, date c актуальной датой и т.п.
      this.loading = false
    }
  },
  components: {
    appHomeBill: HomeBill,
    appHomeCurrency: HomeCurrency
  } 
}
</script>
