<template>
  <span class="status-badge" :class="getStatusClass(status)">
    {{ formatStatus(status) }}
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true
    }
  },
  methods: {
    formatStatus(status) {
      const statusMap = {
        'desperto': 'Desperto',
        'em_transe': 'Em Transe',
        'hibernacao_profunda': 'Hibernação'
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      const classMap = {
        'desperto': 'status-awake',
        'em_transe': 'status-trance',
        'hibernacao_profunda': 'status-hibernation'
      }
      return classMap[status] || ''
    }
  }
}
</script>

<style scoped lang="scss">
@import './StatusBadge.scss';
</style>