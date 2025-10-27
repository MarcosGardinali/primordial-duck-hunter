<template>
  <div v-if="isVisible" class="military-modal-overlay" @click="closeModal">
    <div class="military-modal" @click.stop>
      <div class="modal-header">
        <div class="header-badge">
          <span class="badge-text">FICHA DE ALISTAMENTO</span>
          <span class="badge-code">PDH-2025</span>
        </div>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <div class="modal-body">
        <div class="classification-banner">
          <span>CONFIDENCIAL - OPERAÇÃO PATO PRIMORDIAL</span>
        </div>

        <form @submit.prevent="handleSubmit" class="military-form">
          <div class="form-section">
            <h3>IDENTIFICAÇÃO MILITAR</h3>
            <div class="form-row">
              <BaseInput
                v-model="form.name"
                placeholder="Nome de guerra"
                required
              />
              <BaseInput
                v-model="form.email"
                type="email"
                placeholder="Email para confirmação"
                required
              />
            </div>

            <select v-model="form.bloodType" class="military-select">
              <option value="">Tipo sanguíneo (emergências médicas)</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div class="form-section">
            <h3>DADOS FÍSICOS</h3>
            <div class="form-row">
              <BaseInput
                v-model="form.height"
                type="number"
                step="0.01"
                placeholder="Altura (m)"
              />
              <BaseInput
                v-model="form.weight"
                type="number"
                step="0.1"
                placeholder="Peso (kg)"
              />
            </div>
          </div>

          <div class="form-section">
            <h3>DADOS MILITARES</h3>
            <div class="form-row">
              <select v-model="form.rank" class="military-select" required>
                <option value="">Selecione a patente</option>
                <option value="Soldado">Soldado</option>
                <option value="Cabo">Cabo</option>
                <option value="3º Sargento">3º Sargento</option>
                <option value="2º Sargento">2º Sargento</option>
                <option value="1º Sargento">1º Sargento</option>
                <option value="Subtenente">Subtenente</option>
                <option value="Aspirante">Aspirante</option>
                <option value="2º Tenente">2º Tenente</option>
                <option value="1º Tenente">1º Tenente</option>
                <option value="Capitão">Capitão</option>
                <option value="Major">Major</option>
                <option value="Tenente-Coronel">Tenente-Coronel</option>
                <option value="Coronel">Coronel</option>
                <option value="General">General</option>
              </select>
              <BaseInput
                v-model="form.specialization"
                placeholder="Especialização militar"
              />
            </div>
          </div>

          <div class="form-section">
            <h3>SEGURANÇA</h3>
            <div class="form-row">
              <BaseInput
                v-model="form.password"
                type="password"
                placeholder="Senha de acesso (mín. 6 caracteres)"
                required
              />
              <BaseInput
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirmar senha"
                required
              />
            </div>
          </div>



          <div v-if="error" class="error-message">{{ error }}</div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-cancel">
              CANCELAR OPERAÇÃO
            </button>
            <button type="submit" :disabled="loading" class="btn-submit">
              <span v-if="loading">PROCESSANDO...</span>
              <span v-else>CONFIRMAR ALISTAMENTO</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/shared/BaseInput/BaseInput.vue'
import { useAuthStore } from '@/stores'

export default {
  name: 'MilitaryRegistrationModal',
  components: {
    BaseInput
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'success'],
  data() {
    return {
      authStore: useAuthStore(),
      loading: false,
      error: null,
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bloodType: '',
        height: '',
        weight: '',
        rank: '',
        specialization: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
      this.resetForm()
    },
    
    resetForm() {
      this.form = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bloodType: '',
        height: '',
        weight: '',
        rank: '',
        specialization: ''
      }
      this.error = null
    },



    async handleSubmit() {
      this.error = null
      
      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'As senhas não coincidem'
        return
      }

      if (this.form.password.length < 6) {
        this.error = 'A senha deve ter pelo menos 6 caracteres'
        return
      }

      this.loading = true
      
      try {
        // Registrar usuário
        const result = await this.authStore.register({
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          bloodType: this.form.bloodType || null,
          height: this.form.height ? parseFloat(String(this.form.height).replace(',', '.')) : null,
          weight: this.form.weight ? parseFloat(String(this.form.weight).replace(',', '.')) : null,
          rank: this.form.rank,
          specialization: this.form.specialization || null
        })
        
        // Enviar email de boas-vindas
        const { sendWelcomeEmail } = await import('@/services/emailService')
        await sendWelcomeEmail({
          name: this.form.name,
          email: this.form.email,
          rank: this.form.rank
        })
        
        this.$emit('success')
        this.closeModal()
      } catch (error) {
        this.error = error.message || 'Erro ao processar alistamento'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'MilitaryRegistrationModal.scss';
</style>