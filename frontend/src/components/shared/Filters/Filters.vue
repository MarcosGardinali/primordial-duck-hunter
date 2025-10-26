<template>
  <div class="filters">
    <div class="filters-header">
      <h4><i class="pi pi-filter"></i> FILTROS</h4>
      <button @click="clearFilters" class="clear-btn">LIMPAR</button>
    </div>
    
    <div class="filters-grid">
      <div v-for="filter in filters" :key="filter.key" class="filter-item">
        <label :for="filter.key">{{ filter.label }}:</label>
        
        <!-- Text Input -->
        <input 
          v-if="filter.type === 'text'"
          :id="filter.key"
          v-model="localFilters[filter.key]"
          type="text"
          :placeholder="filter.placeholder"
          class="filter-input"
          @input="onFilterChange"
        />
        
        <!-- Select -->
        <select 
          v-else-if="filter.type === 'select'"
          :id="filter.key"
          v-model="localFilters[filter.key]"
          class="filter-select"
          @change="onFilterChange"
        >
          <option value="">Todos</option>
          <option 
            v-for="option in filter.options" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- Number Range -->
        <div v-else-if="filter.type === 'range'" class="range-inputs">
          <input 
            v-model="localFilters[filter.key + '_min']"
            type="number"
            :placeholder="'Min ' + filter.label"
            class="filter-input range-input"
            @input="onFilterChange"
          />
          <span>-</span>
          <input 
            v-model="localFilters[filter.key + '_max']"
            type="number"
            :placeholder="'Max ' + filter.label"
            class="filter-input range-input"
            @input="onFilterChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Filters',
  props: {
    filters: {
      type: Array,
      required: true
    },
    modelValue: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localFilters: { ...this.modelValue }
    }
  },
  watch: {
    modelValue: {
      handler(newValue) {
        this.localFilters = { ...newValue }
      },
      deep: true
    }
  },
  methods: {
    onFilterChange() {
      this.$emit('update:modelValue', { ...this.localFilters })
    },
    clearFilters() {
      this.localFilters = {}
      this.$emit('update:modelValue', {})
    }
  }
}
</script>

<style scoped lang="scss">
.filters {
  background: var(--theme-bg-card);
  border: 2px solid var(--theme-border-primary);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  font-family: var(--theme-font-family);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h4 {
    color: var(--theme-primary);
    margin: 0;
    font-weight: 700;
    letter-spacing: 0.1em;
  }
}

.clear-btn {
  background: var(--theme-secondary);
  border: none;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-family: var(--theme-font-family);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  
  &:hover {
    background: var(--theme-secondary-dark);
  }
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  
  label {
    color: var(--theme-text-secondary);
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.filter-input, .filter-select {
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border-secondary);
  color: var(--theme-text-primary);
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-family: var(--theme-font-family);
  font-weight: 500;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  
  &:focus {
    outline: none;
    border-color: var(--theme-primary);
    box-shadow: 0 0 5px var(--theme-primary-alpha-medium);
  }
  
  &::placeholder {
    color: var(--theme-text-muted);
  }
}

.filter-input[type="number"]::-webkit-outer-spin-button,
.filter-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.filter-input[type="number"] {
  -moz-appearance: textfield;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  
  span {
    color: var(--theme-text-secondary);
    font-weight: 600;
    flex-shrink: 0;
  }
}

.range-input {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .filters-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .range-inputs {
    flex-direction: column;
    gap: 0.25rem;
    
    span {
      align-self: center;
    }
  }
}
</style>