<template>
    <div class="form-side">
        <div class="form-container">
          <div class="form-content">
            <div class="form-header">
              <h2>Bem-vindo de volta!</h2>
              <p>Entre na sua conta para continuar</p>
            </div>
            
            <form @submit.prevent="handleLogin" class="form">
              <BaseInput
                id="login-email"
                v-model="loginForm.email"
                type="email"
                placeholder="Digite seu email"
                required
              />
              
              <BaseInput
                id="login-password"
                v-model="loginForm.password"
                type="password"
                placeholder="Digite sua senha"
                required
              />
              
              <button type="submit" class="btn-primary" :disabled="authStore.loading">
                <span v-if="authStore.loading">Entrando...</span>
                <span v-else>Entrar</span>
              </button>
              
              <div v-if="authStore.error" class="error">{{ authStore.error }}</div>
            </form>
            
            <div class="forgot-password">
              <button @click="openForgotPassword" class="btn-forgot">
                Esqueci minha senha
              </button>
            </div>
            
            <div class="form-footer">
              <p>Não tem uma conta?</p>
              <button @click="openMilitaryModal" class="btn-link military-btn">
                <span class="btn-icon"><img src="@/assets/icons/badge.svg" alt="Drone" style="width: 18px; height: 18px;"></span>
                Aliste-se
              </button>
              <div class="back-to-landing">
                <router-link to="/" class="btn-link-secondary">
                  ← Voltar ao início
                </router-link>
              </div>
            </div>
          </div>
        </div>
        

    </div>
</template>

<script>
import { useAuthStore } from '@/stores'
import BaseInput from '@/components/shared/BaseInput/BaseInput.vue'

export default {
    name: 'FormSide',
    components: {
        BaseInput
    },
    emits: ['openMilitaryModal'],
    data() {
        return {
            authStore: useAuthStore(),
            loginForm: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        openMilitaryModal() {
            this.$emit('openMilitaryModal')
            this.authStore.clearError()
        },
        
        openForgotPassword() {
            this.$router.push('/forgot-password')
        },
        
        async handleLogin() {
            try {
                await this.authStore.login(this.loginForm)
                this.$router.push('/dashboard')
            } catch (error) {
            }
        }
    }
};
</script>

<style scoped lang="scss">
@import 'FormSide.scss';
</style>
