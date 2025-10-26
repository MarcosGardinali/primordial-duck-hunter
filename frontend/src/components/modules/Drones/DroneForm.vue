<template>
  <form @submit.prevent="handleSubmit">
    <BaseInput
      id="drone-serial"
      v-model="form.serial_number"
      label="Número de Série:"
      type="text"
      required
    />

    <BaseInput
      id="drone-brand"
      v-model="form.brand"
      label="Marca:"
      type="text"
      required
    />

    <BaseInput
      id="drone-manufacturer"
      v-model="form.manufacturer"
      label="Fabricante:"
      type="text"
      required
    />

    <BaseInput
      id="drone-country"
      v-model="form.country_origin"
      label="País de Origem:"
      type="select"
      required
    >
      <option value="">Selecione o país</option>
      <option v-for="country in countries" :key="country" :value="country">
        {{ country }}
      </option>
    </BaseInput>

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
  name: 'DroneForm',
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
        serial_number: '',
        brand: '',
        manufacturer: '',
        country_origin: ''
      },
      countries: [
        'Brasil', 'Estados Unidos', 'China', 'Alemanha', 'Japão',
        'França', 'Reino Unido', 'Coreia do Sul', 'Canadá', 'Austrália'
      ],
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
      
      if (!this.form.serial_number?.trim()) {
        errors.push('Número de série é obrigatório')
      }
      if (!this.form.brand?.trim()) {
        errors.push('Marca é obrigatória')
      }
      if (!this.form.manufacturer?.trim()) {
        errors.push('Fabricante é obrigatório')
      }
      if (!this.form.country_origin?.trim()) {
        errors.push('País de origem é obrigatório')
      }
      
      if (errors.length > 0) {
        this.toast.error('Por favor, preencha todos os campos obrigatórios:\n\n' + errors.join('\n'))
        return false
      }
      
      return true
    },
    resetForm() {
      this.form = {
        serial_number: '',
        brand: '',
        manufacturer: '',
        country_origin: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'DroneForm.scss';
</style>