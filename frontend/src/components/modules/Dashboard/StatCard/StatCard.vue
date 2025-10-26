<template>
  <div class="stat-card" :class="variant">
    <div class="stat-icon">
      <img v-if="icon.endsWith('.svg')" :src="`/src/assets/icons/${icon}`" :alt="icon" style="width: 50px; height: 50px;">
      <span v-else :style="{ fontSize: '24px' }">{{ icon }}</span>
    </div>
    <div class="stat-content">
      <h3>{{ title }}</h3>
      <div class="stat-number">{{ value }}</div>
      <div class="stat-change" :class="changeType">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polyline 
            :points="changeType === 'positive' ? '23,6 13.5,15.5 8.5,10.5 1,18' : '23,18 13.5,8.5 8.5,13.5 1,6'" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
          <polyline 
            :points="changeType === 'positive' ? '17,6 23,6 23,12' : '17,18 23,18 23,12'" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </svg>
        {{ changeText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
    },
    changeText: {
      type: String,
      default: ''
    },
    changeType: {
      type: String,
      default: 'positive',
      validator: value => ['positive', 'negative'].includes(value)
    }
  }
}
</script>

<style scoped lang="scss">
@import './StatCard.scss';
</style>