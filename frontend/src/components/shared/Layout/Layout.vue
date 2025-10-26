<template>
  <div class="layout">
    <Sidebar @toggle="handleSidebarToggle" />
    <div :class="['main-wrapper', { collapsed: sidebarCollapsed }]">
      <Header :sidebar-collapsed="sidebarCollapsed" />
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/shared/Sidebar/Sidebar.vue'
import Header from '@/components/shared/Header/Header.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Header
  },
  data() {
    return {
      sidebarCollapsed: false
    }
  },
  methods: {
    handleSidebarToggle(collapsed) {
      this.sidebarCollapsed = collapsed
    }
  }
}
</script>

<style scoped lang="scss">
@import 'Layout.scss';
</style>