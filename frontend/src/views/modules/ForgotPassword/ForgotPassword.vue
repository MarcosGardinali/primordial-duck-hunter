<template>
  <div class="forgot-container">
    <div class="forgot-card">
      <div class="header">
        <div class="badge">
          <span class="badge-text">RECUPERAÇÃO DE SENHA</span>
          <span class="badge-code">PDH-2025</span>
        </div>
      </div>

      <div class="content">
        <div class="classification-banner">
          <span>CONFIDENCIAL - SISTEMA DE RECUPERAÇÃO</span>
        </div>

        <!-- Etapa 1: Solicitar email -->
        <div v-if="step === 1" class="step-content">
          <h2>Recuperar Acesso</h2>
          <p>Digite seu email militar para receber o código de recuperação:</p>
          
          <form @submit.prevent="sendResetCode" class="reset-form">
            <input
              v-model="email"
              type="email"
              placeholder="Email militar"
              required
              class="military-input"
            />
            
            <div v-if="error" class="error-message">{{ error }}</div>
            
            <button type="submit" :disabled="loading" class="btn-send">
              <span v-if="loading">ENVIANDO...</span>
              <span v-else>ENVIAR CÓDIGO</span>
            </button>
          </form>
        </div>

        <!-- Etapa 2: Verificar código -->
        <div v-if="step === 2" class="step-content">
          <h2>Código de Verificação</h2>
          <p>Digite o código enviado para: <strong>{{ email }}</strong></p>
          
          <div class="code-inputs">
            <input
              v-for="(digit, index) in code"
              :key="index"
              v-model="code[index]"
              type="text"
              maxlength="1"
              class="code-input"
              @input="handleInput(index, $event)"
              @keydown="handleKeydown(index, $event)"
              @paste="handlePaste($event)"
              :ref="'input' + index"
            />
          </div>
          
          <div v-if="error" class="error-message">{{ error }}</div>
          
          <div class="button-row">
            <button @click="verifyCode" :disabled="loading || !isCodeComplete" class="btn-verify">
              <span v-if="loading">VERIFICANDO...</span>
              <span v-else>VERIFICAR CÓDIGO</span>
            </button>
            
            <button @click="resendCode" :disabled="resendLoading" class="btn-resend">
              <span v-if="resendLoading">Reenviando...</span>
              <span v-else>Reenviar código</span>
            </button>
          </div>
        </div>

        <!-- Etapa 3: Nova senha -->
        <div v-if="step === 3" class="step-content">
          <h2>Nova Senha</h2>
          <p>Defina sua nova senha de acesso:</p>
          
          <form @submit.prevent="resetPassword" class="reset-form">
            <input
              v-model="newPassword"
              type="password"
              placeholder="Nova senha (mín. 6 caracteres)"
              required
              class="military-input"
            />
            
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirmar nova senha"
              required
              class="military-input"
            />
            
            <div v-if="error" class="error-message">{{ error }}</div>
            
            <button type="submit" :disabled="loading" class="btn-reset">
              <span v-if="loading">REDEFININDO...</span>
              <span v-else">REDEFINIR SENHA</span>
            </button>
          </form>
        </div>

        <div class="back-section">
          <router-link to="/login" class="btn-back">
            ← Voltar ao Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores'
import emailService from '@/services/emailService'
import { useToast } from 'vue-toastification'

export default {
  name: 'ForgotPassword',
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      authStore: useAuthStore(),
      step: 1,
      email: '',
      code: ['', '', '', '', '', ''],
      newPassword: '',
      confirmPassword: '',
      loading: false,
      resendLoading: false,
      error: null,
      resetCode: null
    }
  },
  computed: {
    isCodeComplete() {
      return this.code.every(digit => digit !== '')
    }
  },
  methods: {
    async sendResetCode() {
      this.loading = true
      this.error = null
      
      try {
        // Gerar código
        this.resetCode = Math.random().toString(36).substr(2, 6).toUpperCase()
        
        // Enviar email de redefinição
        await emailService.sendPasswordResetEmail({
          name: 'Soldado',
          email: this.email
        }, this.resetCode)
        
        this.step = 2
      } catch (error) {
        this.error = 'Erro ao enviar código. Verifique o email.'
      } finally {
        this.loading = false
      }
    },
    
    verifyCode() {
      const codeString = this.code.join('')
      
      if (codeString === this.resetCode) {
        this.step = 3
        this.error = null
      } else {
        this.error = 'Código inválido'
      }
    },
    
    async resetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'As senhas não coincidem'
        return
      }
      
      if (this.newPassword.length < 6) {
        this.error = 'A senha deve ter pelo menos 6 caracteres'
        return
      }
      
      this.loading = true
      this.error = null
      
      try {
        const codeString = this.code.join('')
        await this.authStore.resetPassword(this.email, codeString, this.newPassword)
        this.$router.push('/login')
        this.toast.success('Senha redefinida com sucesso! Faça login com sua nova senha.')
      } catch (error) {
        this.toast.error('Erro ao redefinir senha. Tente novamente.')
      } finally {
        this.loading = false
      }
    },
    
    async resendCode() {
      this.resendLoading = true
      
      try {
        this.resetCode = Math.random().toString(36).substr(2, 6).toUpperCase()
        await emailService.sendPasswordResetEmail({
          name: 'Soldado',
          email: this.email
        }, this.resetCode)
        
        this.code = ['', '', '', '', '', '']
        this.$refs.input0[0].focus()
      } catch (error) {
        this.error = 'Erro ao reenviar código'
      } finally {
        this.resendLoading = false
      }
    },
    
    handleInput(index, event) {
      const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
      this.code[index] = value
      
      if (value && index < 5) {
        this.$refs['input' + (index + 1)][0].focus()
      }
    },
    
    handleKeydown(index, event) {
      if (event.key === 'Backspace' && !this.code[index] && index > 0) {
        this.$refs['input' + (index - 1)][0].focus()
      }
      
      if (event.key === 'ArrowLeft' && index > 0) {
        this.$refs['input' + (index - 1)][0].focus()
      }
      
      if (event.key === 'ArrowRight' && index < 5) {
        this.$refs['input' + (index + 1)][0].focus()
      }
    },
    
    handlePaste(event) {
      event.preventDefault()
      const pastedData = event.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '')
      
      if (pastedData.length === 6) {
        for (let i = 0; i < 6; i++) {
          this.code[i] = pastedData[i] || ''
        }
        this.$refs.input5[0].focus()
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'ForgotPassword.scss';
</style>