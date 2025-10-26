<template>
  <div v-if="show" class="modal-overlay" @click="onCancel">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-actions">
        <button @click="onCancel" class="btn btn-secondary">{{ cancelText }}</button>
        <button @click="onConfirm" class="btn btn-danger">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmar ação'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    }
  },
  emits: ['confirm', 'cancel'],
  methods: {
    onConfirm() {
      this.$emit('confirm')
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--theme-bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal {
  background: var(--theme-bg-primary);
  border: 2px solid var(--theme-border-primary);
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: var(--theme-shadow-primary);
  backdrop-filter: blur(20px);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--theme-border-secondary);
}

.modal-header h3 {
  margin: 0;
  color: var(--theme-primary);
  font-weight: 700;
  text-shadow: 0 0 10px var(--theme-primary-alpha-medium);
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0;
  color: var(--theme-text-primary);
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--theme-border-secondary);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary {
  background: transparent;
  color: var(--theme-text-muted);
  border-color: var(--theme-border-secondary);
}

.btn-secondary:hover {
  background: var(--theme-primary-alpha);
  color: var(--theme-primary);
  border-color: var(--theme-border-primary);
}

.btn-danger {
  background: var(--theme-gradient-secondary);
  color: white;
  border-color: var(--theme-border-danger);
  box-shadow: var(--theme-shadow-danger);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px var(--theme-secondary-alpha-medium);
}

.btn:active {
  transform: scale(0.98);
}
</style>