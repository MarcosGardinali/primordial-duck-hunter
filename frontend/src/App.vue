<template>
  <div id="app">
    <Layout v-if="shouldShowLayout">
      <router-view />
    </Layout>
    <router-view v-else />
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth/auth'
import Layout from '@/components/shared/Layout/Layout.vue'

export default {
  name: 'App',
  components: {
    Layout
  },
  data() {
    return {
      authStore: useAuthStore()
    }
  },
  computed: {
    shouldShowLayout() {
      const publicRoutes = ['Landing', 'Login']
      return this.authStore.isAuthenticated && !publicRoutes.includes(this.$route.name)
    }
  },

}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
}
</style>