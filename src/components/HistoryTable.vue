<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{ 'Amount' | localize }}</th>
        <th>{{ 'Date' | localize }}</th>
        <th>{{ 'Category' | localize }}</th>
        <th>{{ 'Type' | localize }}</th>
        <th>{{ 'Open' | localize }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, idx) of records" :key="record.id">
        <td>{{ idx + 1 }}</td>
        <td>{{ record.amount | currencyFilter('RUB') }}</td>
        <td>{{ record.date | dateFilter('datetime') }}</td>
        <td>{{ record.categoryName }}</td>
        <td>
          <span class="white-text badge" :class="[record.typeClass]"> {{ record.typeText }} </span>
        </td>
        <td>
          <button 
            class="btn-small btn" 
            @click="$router.push(`detail/${record.id}`)"
            v-tooltip="localizeFilter('Watch_Recording')"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import localizeFilter from '@/filters/localize.filter'

  export default {
    methods: {
      localizeFilter
    },
    props: {
      records: {
        required: true,
        type: Array
      }
    }
  }
</script>
  