<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title"> {{ 'Currency_Account' | localize }} </span>

        <p 
          v-for="cur of currencies"
          :key="cur"
          class="currency-line"
        >
          <span>
            {{getCurrency(cur) | currencyFilter(cur)}} 
          </span>
        </p>
      </div>
    </div>
  </div> 
</template>

<script>
export default {
  props: ['rates'], //пропс переданный из Home.vue, объект с валютами
  data() {
    return {
      currencies: ['RUB','EUR','USD']
    }
  },
  computed: {
    base() {
      return this.$store.getters.info.bill / (this.rates['RUB'] / this.rates['EUR']) //100000 / (71 / 1) - сколько всего у нас евро
      //info - это объект с данными о пользователе содержит name: string и bill: number
    }    
  },
  methods: {
    getCurrency(currency) {
      return Math.floor(this.base  * this.rates[currency])
    }
  }
}
</script>