import _ from 'lodash'

export default {
  data() {
    return {
      page: +this.$route.query.page  || 1, //дефолтная страница
      pageSize: 5, //сколько показывать элементов на одной странице
      pageCount: 0, // сколько будет всего страниц
      allItems: [], //тут будет весь массив
      items: [], // тут массив тех элементов, которые будут покзываться
    }
  },
  methods: {
    pageChangeHandler(page){ // параметр page нам уже дает плагин vuejs-paginate
      this.$router.push(`${this.$route.path}?page=${page}`) //this.$route.path - текущая страница (пример: /history)
      this.items = this.allItems[page - 1] || this.allItems[0]
    },
    setupPagination(allItems) {
      this.allItems = _.chunk(allItems, this.pageSize) //вернет массив с массивами. К примеру allItems = 17, а pageSize = 5, тогда вернет массив из 4 массивов, в первых трех будет по 5 элементов, а в четвертом 2
      this.pageCount = _.size(this.allItems) // _.size - считает длину массива
      
      this.items = this.allItems[this.page - 1] || this.allItems[0]
    }
  }
}