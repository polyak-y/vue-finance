<template>
  <div>
    <div class="page-title">
      <h3> {{ 'Menu_Categories' | localize }} </h3> 
    </div>

    <section>
      <Loader v-if="loading" />

      <div v-else class="row">

        <CategoryCreate @created="addNewCategory"/>
        <!-- this.$emit('created', category) - это мы написали внутри CategoryCreate, то етсь при нажати на кнопку в  CategoryCreate мы эмитим событием created, а тут на это событие вешается функция addNewCategory, при этом в качетве параметра функция принимает category(объект) -->

        <CategoryEdit 
          :categories="categories"
          @updated="updateCategories"
          :key="categories.length + updateCount"
          v-if="categories.length"
        />
        <!-- :key для принудительной переррисовки компонента. Как только :key изменяет своё значение так сразу же перерисовывается компонент, а значение внутри :key мы можем менять сами -->

        <h3 v-else class="center">категорий пока нет</h3>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'
import Loader from '@/components/app/Loader'

export default {
  name: 'categories',
  data() {
    return {
      categories: [],
      loading: true,
      updateCount: 0,
    }
  },
  metaInfo() { // метод из библиотеки vue-meta которую мы установили
    return {
      title: this.$title('Menu_Categories')
    }    
  },
  async mounted() { //жизненный цикл
    this.categories = await this.$store.dispatch('fetchCategories') //испоьзовали async-await вместо then. Экшн вызываем в store/category.js для получения списка категорий
    this.loading = false
 },
  components: {
    CategoryCreate,
    CategoryEdit,
    Loader
  },
  methods: {
    addNewCategory(category){ //метод который вызывает кастомном событии emit - created который мы назначили в CategoryCreate.vue
      this.categories.push(category)
    },
    updateCategories(category) { //метод который срабатывает при кастомном событии updated, который мы назначили в CategoryEdit.vue
      const ind = this.categories.findIndex(elem => elem.id === category.id)
      this.categories[ind].title = category.title
      this.categories[ind].limit = category.limit
      this.updateCount++ //это для изменения key в <CategoryEdit /> и следовательно для перерисовки данного компонента
    }
  }
}
</script>