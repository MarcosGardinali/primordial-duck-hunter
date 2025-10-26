<template>
  <div class="structure">
    <component :is="currentComponent" />
  </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth/auth'
import Layout from '../../components/shared/Layout/Layout.vue'

export default {
  name: 'Structure',
  components: {
    Layout
  },
  computed: {
    currentComponent() {
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? 'Layout' : 'router-view'
    }
  }
}
</script>

<style lang="scss" scoped>
@import './Structure.scss';
</style>