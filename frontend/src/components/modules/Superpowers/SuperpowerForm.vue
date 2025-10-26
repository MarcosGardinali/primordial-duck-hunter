<template>
  <form @submit.prevent="handleSubmit">
    <BaseInput
      id="superpower-name"
      v-model="form.name"
      label="Nome do Superpoder:"
      type="text"
      placeholder="Ex: Tempestade Elétrica"
      required
    />

    <BaseInput
      id="superpower-description"
      v-model="form.description"
      label="Descrição:"
      type="textarea"
      placeholder="Descreva o que o superpoder faz..."
      :rows="4"
      required
    />

    <div class="form-group">
      <BaseInput
        id="superpower-classification"
        v-model="form.classification"
        label="Classificações (separadas por vírgula):"
        type="text"
        placeholder="Ex: bélico, raro, alto risco de curto-circuito"
        required
      />
      <small>Exemplos: bélico, defensivo, raro, comum, alto risco, baixo risco, elemental, psíquico</small>
    </div>

    <div class="modal-actions">
      <button type="button" @click="$emit('cancel')" class="btn btn-secondary">Cancelar</button>
      <button type="submit" class="btn btn-primary">
        {{ isEdit ? 'Atualizar' : 'Adicionar' }}
      </button>
    </div>
  </form>
</template>

<script>
import BaseInput from '@/components/shared/BaseInput/BaseInput.vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'SuperpowerForm',
  components: {
    BaseInput
  },
  props: {
    initialData: Object,
    isEdit: Boolean
  },
  emits: ['submit', 'cancel'],
  data() {
    return {
      form: {
        name: '',
        description: '',
        classification: ''
      },
      toast: useToast()
    }
  },
  watch: {
    initialData: {
      immediate: true,
      handler(data) {
        if (data) {
          this.form = { ...data }
        } else {
          this.resetForm()
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      if (!this.validateForm()) {
        return
      }
      this.$emit('submit', this.form)
    },
    validateForm() {
      const errors = []
      
      if (!this.form.name?.trim()) {
        errors.push('Nome do superpoder é obrigatório')
      }
      if (!this.form.description?.trim()) {
        errors.push('Descrição é obrigatória')
      }
      if (!this.form.classification?.trim()) {
        errors.push('Classificação é obrigatória')
      }
      
      if (errors.length > 0) {
        this.toast.error('Por favor, preencha todos os campos obrigatórios:\n\n' + errors.join('\n'))
        return false
      }
      
      return true
    },
    resetForm() {
      this.form = {
        name: '',
        description: '',
        classification: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: 500;
  color: #e2e8f0;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #00ff00;
  border-radius: 0.5rem;
  background: #1e293b;
  color: #e2e8f0;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
}

.form-input::placeholder {
  color: #94a3b8;
}

.form-group small {
  color: #94a3b8;
  font-size: 0.8rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 0 0 0;
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

.btn-primary {
  background: #00ff00;
  color: #000000;
  border-color: #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
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

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary:hover {
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.7);
}
</style>