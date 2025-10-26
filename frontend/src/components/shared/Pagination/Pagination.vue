<template>
  <div class="pagination" v-if="totalPages > 1">
    <button 
      @click="goToPage(1)" 
      :disabled="currentPage === 1"
      class="pagination-btn"
    >
      <i class="pi pi-angle-double-left"></i>
    </button>
    
    <button 
      @click="goToPage(currentPage - 1)" 
      :disabled="currentPage === 1"
      class="pagination-btn"
    >
      <i class="pi pi-angle-left"></i>
    </button>
    
    <span class="pagination-info">
      {{ currentPage }} / {{ totalPages }}
    </span>
    
    <button 
      @click="goToPage(currentPage + 1)" 
      :disabled="currentPage === totalPages"
      class="pagination-btn"
    >
      <i class="pi pi-angle-right"></i>
    </button>
    
    <button 
      @click="goToPage(totalPages)" 
      :disabled="currentPage === totalPages"
      class="pagination-btn"
    >
      <i class="pi pi-angle-double-right"></i>
    </button>
    

  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    }
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-changed', page)
      }
    },

  }
}
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
  font-family: var(--theme-font-family);
}

.pagination-btn {
  background: var(--theme-bg-card);
  border: 2px solid var(--theme-border-primary);
  color: var(--theme-primary);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--theme-font-family);
  font-weight: 600;
  
  &:hover:not(:disabled) {
    background: var(--theme-primary-alpha);
    box-shadow: var(--theme-shadow-secondary);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pagination-info {
  color: var(--theme-text-primary);
  font-weight: 600;
  padding: 0 1rem;
  font-family: var(--theme-font-family);
}


</style>