<template>
  <div class="chart-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <p v-if="subtitle" class="subtitle-light">{{ subtitle }}</p>
    </div>
    <div class="chart-content" :class="{ 'map-content': isMap }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartCard',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    isMap: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
@import './ChartCard.scss';
</style>