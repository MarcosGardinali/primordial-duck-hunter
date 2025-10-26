<template>
  <div class="superpower-card">
    <div class="superpower-header">
      <h3>{{ superpower.name }}</h3>
      <div class="action-buttons">
        <button @click="$emit('edit', superpower)" class="btn btn-sm btn-secondary">Editar</button>
        <button @click="$emit('delete', superpower)" class="btn btn-sm btn-danger">Excluir</button>
      </div>
    </div>
    <p class="superpower-description">{{ superpower.description }}</p>
    <div class="superpower-classification">
      <strong>Classificações:</strong>
      <div class="classification-tags">
        <span v-for="tag in classificationTags" :key="tag" class="classification-tag">
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="superpower-date">
      Cadastrado em: {{ formatDate(superpower.created_at) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuperpowerCard',
  props: {
    superpower: Object
  },
  emits: ['edit', 'delete'],
  computed: {
    classificationTags() {
      return this.superpower.classification.split(',').map(tag => tag.trim())
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pt-BR')
    }
  }
}
</script>

<style scoped lang="scss">
.superpower-card {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.superpower-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
  border-color: #00ff00;
}

.superpower-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.superpower-header h3 {
  margin: 0;
  color: #00ff00;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.superpower-description {
  color: #e2e8f0;
  line-height: 1.5;
  margin-bottom: 15px;
}

.superpower-classification {
  margin-bottom: 15px;
  color: #e2e8f0;
}

.classification-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.classification-tag {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.superpower-date {
  font-size: 0.8rem;
  color: #94a3b8;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 10px;
}

.btn {
  padding: 0.5rem 1rem;
  border: 2px solid;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.btn-secondary {
  background: transparent;
  color: #94a3b8;
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(0, 255, 0, 0.1);
  color: #00ff00;
  border-color: #00ff00;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-danger:hover {
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
}

@media (max-width: 480px) {
  .superpower-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}
</style>