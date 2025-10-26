<template>
  <div>
    <!-- Mobile Menu Button -->
    <button @click="toggleMobileSidebar" class="mobile-menu-btn" v-if="isMobile && !mobileOpen">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    
    <!-- Mobile Overlay -->
    <div v-if="isMobile && mobileOpen" class="mobile-overlay" @click="closeMobileSidebar"></div>
    
    <!-- Sidebar -->
    <div :class="['sidebar', { 
      collapsed: isCollapsed && !isMobile, 
      'mobile-open': mobileOpen && isMobile,
      'mobile-hidden': !mobileOpen && isMobile
    }]">
      <div class="sidebar-header">
        <div class="logo" v-if="!isCollapsed || isMobile">
          <img src="@/assets/images/cc-logo.png" alt="Duck Hunter Logo" class="sidebar-logo-image" style="width: 48px; height: 48px;" />
          <span class="logo-text">Duck Hunter</span>
        </div>
        
        <button @click="isMobile ? closeMobileSidebar() : toggleSidebar()" class="toggle-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path v-if="isMobile" d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path v-else-if="!isCollapsed" d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path v-else d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item" @click="handleNavClick">
          <div class="nav-icon">
            <img src="@/assets/icons/dashboard.svg" alt="dashboard" style="width: 36px; height: 36px;">
          </div>
          <span v-if="!isCollapsed || isMobile" class="nav-text">Dashboard</span>
        </router-link>

        <div v-if="!isCollapsed || isMobile" class="nav-section">
          <div class="section-title">Missão Patos Primordiais</div>
        </div>
        
        <router-link to="/drones" class="nav-item" @click="handleNavClick">
          <div class="nav-icon">
            <img src="@/assets/icons/drone.svg" alt="Drone" style="width: 36px; height: 36px;">
          </div>
          <span v-if="!isCollapsed || isMobile" class="nav-text">Drones</span>
        </router-link>
        
        <router-link to="/superpowers" class="nav-item" @click="handleNavClick">
          <div class="nav-icon">
            <img src="@/assets/icons/superpower.svg" alt="Superpower" style="width: 36px; height: 36px;">
          </div>
          <span v-if="!isCollapsed || isMobile" class="nav-text">Superpoderes</span>
        </router-link>
        
        <router-link to="/primordial-ducks" class="nav-item" @click="handleNavClick">
          <div class="nav-icon">
            <img src="@/assets/icons/duck.svg" alt="Duck" style="width: 36px; height: 36px;">
          </div>
          <span v-if="!isCollapsed || isMobile" class="nav-text">Catálogo de Patos</span>
        </router-link>
        
        <router-link to="/capture-analysis" class="nav-item" @click="handleNavClick">
          <div class="nav-icon">
            <img src="@/assets/icons/target.svg" alt="Target" style="width: 36px; height: 36px;">
          </div>
          <span v-if="!isCollapsed || isMobile" class="nav-text">Análise de Captura</span>
        </router-link>
        
        <router-link to="/drone-control" class="nav-item" @click="handleNavClick">
          <div class="nav-icon">
            <img src="@/assets/icons/drone.svg" alt="Drone" style="width: 36px; height: 36px;">
          </div>
          <span v-if="!isCollapsed || isMobile" class="nav-text">Controle do Drone</span>
        </router-link>
        
        <router-link to="/captured-ducks" class="nav-item" @click="handleNavClick">
          <div class="nav-icon">
            <img src="@/assets/icons/reward.svg" alt="reward" style="width: 36px; height: 36px;">
          </div>
          <span v-if="!isCollapsed || isMobile" class="nav-text">Patos Capturados</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isCollapsed: false,
      mobileOpen: false,
      isMobile: false
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
      if (!this.isMobile) {
        this.mobileOpen = false
      }
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
      this.$emit('toggle', this.isCollapsed)
    },
    toggleMobileSidebar() {
      this.mobileOpen = !this.mobileOpen
    },
    closeMobileSidebar() {
      this.mobileOpen = false
    },
    handleNavClick() {
      if (this.isMobile) {
        this.closeMobileSidebar()
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'Sidebar.scss';
</style>