<template>
  <div>
    <Loader v-if="loading"/>
    
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb"> {{ 'Menu_History' | localize }} </router-link>
        <a @click.prevent class="breadcrumb">
          {{ record.type === 'outcome' ? localizeFilter('Table_Expense') : localizeFilter('Table_Income') }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="[record.type === 'outcome' ? 'red' : 'green']">
            <div class="card-content white-text">
              <p>{{ 'Description' | localize }}: {{record.description}}</p>
              <p>{{ 'Amount' | localize }}: {{ record.amount | currencyFilter('RUB')}}</p>
              <p>{{ 'Category' | localize }}: {{ record.categoryName }}</p>
              <small> {{ record.date | dateFilter('datetime') }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h5 class="center" v-else>Запись с id=<b>{{ $route.params.id }}</b> не найдена</h5>
  </div>
</template>

<script>
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'detail',
  data: () => ({
    record: null,
    loading: true
  }), 
  methods: {
    localizeFilter
  },
  metaInfo() { // метод из библиотеки vue-meta которую мы установили
    return {
      title: this.$title('Detail_Title')
    }    
  },
  async mounted() {
    const id = this.$route.params.id // получили id из строки браузера
    const record = await this.$store.dispatch('fetchRecordById', id) //получение текущей записи по id. fetchRecordById - в  store/record.js
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId) //получение текущей категории по id. fetchCategoryById - в  store/category.js

    this.record = {
      ...record,
      categoryName: category.title
    }

    this.loading = false 
  },
}
</script>