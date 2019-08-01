<template>
  <ul class="sidenav app-sidenav" :class="{'open': value}">

    <router-link 
      v-for="link of links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
    >
      <a class="waves-effect waves-orange pointer">{{link.title}}</a>
    </router-link>
    
  </ul>
</template>

<script>
import LocalizeFilter from '../../filters/localize.filter'

export default {
  props: ['value'], // этот пропс мы получили через v-model MainLayout, а так как через v-model, то пропс будет называться value
  data() {
    return {
      links: [
        {title: LocalizeFilter('Menu_Bill'), url: '/', exact: true},
        {title: LocalizeFilter('Menu_History'), url: '/history'},
        {title: LocalizeFilter('Menu_Planning'), url: '/planning'},
        {title: LocalizeFilter('Menu_NewRecord'), url: '/record'},
        {title: LocalizeFilter('Menu_Categories'), url: '/categories'}
      ]
    }
  }
}
</script>
