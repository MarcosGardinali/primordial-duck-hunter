<template>
  <div class="stats-grid">
    <BaseCard v-for="stat in stats" :key="stat.title" :title="stat.title">
      <div class="stat-number">{{ stat.value }}</div>
      <div v-if="stat.label" class="stat-label">{{ stat.label }}</div>
      <slot :name="stat.key" :stat="stat" />
    </BaseCard>
  </div>
</template>

<script>
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'

export default {
  name: 'StatsGrid',
  components: {
    BaseCard
  },
  props: {
    stats: Array
  }
}
</script>

<style scoped lang="scss">
@import 'StatsGrid.scss';
</style>