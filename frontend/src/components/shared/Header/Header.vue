<template>
  <header :class="['header', { collapsed: sidebarCollapsed }]">
    <div class="header-content">
      <div class="header-left">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-subtitle" v-if="pageSubtitle">{{ pageSubtitle }}</p>
      </div>
      
      <div class="header-right">
        <div class="user-info">
          <span class="user-name">{{ authStore.user?.name }}</span>
          <span class="user-role">{{ authStore.user?.rank ?? '' }}</span>
        </div>
        
        <button @click="logout" class="logout-btn" title="Sair">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth/auth'

export default {
  name: 'Header',
  props: {
    sidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      authStore: useAuthStore()
    }
  },
  computed: {
    pageTitle() {
      return this.$route.meta?.title || 'Dashboard'
    },
    pageSubtitle() {
      return this.$route.meta?.subtitle
    }
  },
  methods: {
    logout() {
      this.authStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="scss">
@import 'Header.scss';
</style>