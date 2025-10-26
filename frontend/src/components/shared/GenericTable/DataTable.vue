<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
          <th v-if="actions">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td v-for="column in columns" :key="column.key">
            <slot :name="column.key" :item="item" :value="item[column.key]">
              {{ formatValue(item[column.key], column.type) }}
            </slot>
          </td>
          <td v-if="actions">
            <div class="action-buttons">
              <slot name="actions" :item="item" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    data: Array,
    columns: Array,
    actions: Boolean
  },
  methods: {
    formatValue(value, type) {
      if (type === 'date' && value) {
        return new Date(value).toLocaleDateString('pt-BR')
      }
      return value
    }
  }
}
</script>

<style scoped lang="scss">
@import 'DataTable.scss';
</style>