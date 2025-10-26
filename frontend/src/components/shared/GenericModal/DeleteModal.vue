<template>
  <div v-if="show" class="modal-overlay" @click="$emit('cancel')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="$emit('cancel')" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-actions">
        <button @click="$emit('cancel')" class="btn btn-secondary">Cancelar</button>
        <button @click="$emit('confirm')" class="btn btn-danger">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmar Exclusão'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Excluir'
    }
  },
  emits: ['confirm', 'cancel']
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #0f172a;
  border: 2px solid #00ff00;
  border-radius: 1rem;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
  width: 90%;
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  color: #00ff00;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #00ff00;
}

.modal-body {
  padding: 1.5rem;
  color: #e2e8f0;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
}
</style>