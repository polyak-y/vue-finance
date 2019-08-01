<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Record_History' | localize }}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />

    <h5 class="center" v-else-if="!records.length">
      {{ 'No_Records_Yet' | localize }}
      <router-link to="/record">{{ 'Add_The_First' | localize }}</router-link>
    </h5>

    <section v-else>
      <app-history-table :records="items"></app-history-table><!--items взят из миксина, это тот массив котоырй будет показываться  -->

      <app-paginate
        v-model="page" 
        :page-count="pageCount" 
        :click-handler="pageChangeHandler"
        :prev-text="localizeFilter('Prev')"
        :next-text="localizeFilter('Next')"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      ></app-paginate>
      <!-- pageCount - взято из миксина, сколько всего будет страниц -->
      <!-- pageChangeHandler - метод из миксина для переходя по пагинации -->
      <!-- page - номер страницы, тоже из миксина -->

    </section>
  </div>
</template>

<script>
  import HistoryTable from '@/components/HistoryTable'
  import paginationMixin from '@/mixins/pagination.mixin' // импортировали миксин
  import { Pie } from 'vue-chartjs'
  import localizeFilter from '@/filters/localize.filter'


  export default {
    name: 'history',
    extends: Pie,
    mixins: [paginationMixin], //подключили наш миксин, он мержит данные с миксина с данными на этой странице
    data() {
      return {
        loading: true,
        records: [],
      }
    },   
    metaInfo() { // метод из библиотеки vue-meta которую мы установили
      return {
        title: this.$title('Menu_History')
      }    
    },
    methods: {
      localizeFilter: localizeFilter,
      setup(categories){
        this.setupPagination(this.records.map((record) => { //setupPagination - из миксина 
          return {
            ...record,
            categoryName: (categories.find(elem => elem.id === record.categoryId).title),
            typeClass: record.type === 'income' ? 'green' : 'red',
            typeText: record.type === 'income' ? localizeFilter('Table_Income') : localizeFilter('Table_Expense')
          }
        }))
      }
    },
    async mounted() { //жизненный цикл компонента
      this.records = await this.$store.dispatch('fetchRecords') //диспать вызывается в store/record.js для получеения сведений о движении доходов/расходов
      const categories = await this.$store.dispatch('fetchCategories') // получение всех категорий из базы данных по указанному пользователю

      this.setup(categories)


      this.renderChart({
        labels: categories.map(cat => cat.title),
        datasets: [{
            label: 'Расходы по категориям',
            data: categories.map(cat => {
              return this.records.reduce((total, record) => {
                
                if(record.categoryId === cat.id && record.type === 'outcome') {
                  total += record.amount
                } 

                return total
              }, 0)
            }),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
        }]
      })

      this.loading = false
    },
    components: {
      appHistoryTable: HistoryTable
    }
  }
</script>