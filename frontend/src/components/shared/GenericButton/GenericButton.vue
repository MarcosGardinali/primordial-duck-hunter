<template>
  <button 
    :class="['generic-btn', `generic-btn-${variant}`, { 'generic-btn-loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
    :type="type"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<script>
export default {
  name: 'GenericButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline', 'danger'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button'
    }
  },
  emits: ['click']
}
</script>

<style scoped lang="scss">
@import 'GenericButton.scss';
</style>