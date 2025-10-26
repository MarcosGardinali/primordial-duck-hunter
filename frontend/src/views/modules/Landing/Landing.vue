<template>
  <div class="landing-container">
    <section class="hero-section">
      <div class="military-overlay"></div>
      <div class="hero-content">
        <div class="mission-badge">
          <span class="badge-text">OPERAÇÃO CLASSIFICADA</span>
        </div>
        
        <h1 class="hero-title">
          <span class="title-line">PRIMORDIAL</span>
          <span class="title-line highlight">DUCK HUNTER</span>
        </h1>
        
        <p class="hero-subtitle">SISTEMA DE CAÇA E CATALOGAÇÃO MILITAR</p>
        
        <div class="mission-briefing">
          <h2>BRIEFING DA MISSÃO</h2>
          <p>
            Sabíamos que podíamos contar com sua <strong>coragem e inteligência</strong>! 
            Agora chegou o momento de encarar uma nova missão: encontrar onde os 
            <strong>Patos Primordiais</strong> foram escondidos, recuperar cada um deles 
            e reunir o máximo de informações possível.
          </p>
        </div>

        <div class="hunt-invitation">
          <h3>CONVITE À CAÇADA</h3>
          <div class="video-container">
            <div v-if="!videoEnabled" class="video-overlay" @click="enableVideo">
              <div class="play-button">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                  <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
              </div>
              <div class="audio-warning">
                <span class="warning-icon"><i class="pi pi-volume-up"></i></span>
                <p>Este vídeo contém áudio</p>
                <p class="click-text">Clique para habilitar e assistir</p>
              </div>
            </div>
            <div v-if="videoEnded" class="video-overlay" @click="replayVideo">
              <div class="play-button">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                  <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3.51 15A9 9 0 0 0 21 12A9 9 0 0 0 11.5 3.04L7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="audio-warning">
                <p>Adorei o convite e quero ver denovo!</p>
              </div>
            </div>
            <video 
              ref="huntVideo"
              :class="['hunt-video', { 'video-hidden': !videoEnabled }]"
              preload="metadata"
              @ended="onVideoEnded"
            >
              <source src="@/assets/hunt-invite.mp4" type="video/mp4">
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>

        <div class="mission-objectives">
          <h3>OBJETIVOS PRINCIPAIS</h3>
          <div class="objectives-grid">
            <div class="objective-card">
              <div class="objective-icon"><img src="@/assets/icons/duck.svg" alt="Drone" style="width: 58px; height: 58px;"></div>
              <h4>1ª MISSÃO</h4>
              <p>Catalogar informações dos Patos Primordiais descobertos pelos drones de reconhecimento</p>
            </div>
            <div class="objective-card">
              <div class="objective-icon"><img src="@/assets/icons/target.svg" alt="Drone" style="width: 58px; height: 58px;"></div>
              <h4>2ª MISSÃO</h4>
              <p>Operação Visão de Captura - Análise de custo-benefício e classificação de alvos</p>
            </div>
            <div class="objective-card">
              <div class="objective-icon"><img src="@/assets/icons/drone.svg" alt="Drone" style="width: 58px; height: 58px;"></div>
              <h4>3ª MISSÃO</h4>
              <p>Capturar o Pato Primordial - Controle do drone de combate e execução da missão</p>
            </div>
          </div>
        </div>

        <div class="recruitment-section">
          <h3>ALISTAMENTO MILITAR</h3>
          <p class="recruitment-text">
            Você tem o que é preciso para enfrentar esta missão? 
            <br>Junte-se à elite dos caçadores de Patos Primordiais!
          </p>
          
          <button @click="handleEnlistment" class="enlist-btn">
            <span class="btn-icon"><img src="@/assets/icons/badge.svg" alt="Drone" style="width: 58px; height: 58px;"></span>
            ALISTAR-SE AGORA
            <span class="btn-arrow"><i class="pi pi-arrow-right"></i></span>
          </button>
          
          <div class="warning-notice">
            <span class="warning-icon"><i class="pi pi-exclamation-triangle"></i></span>
            ATENÇÃO: Missão de alto risco. Apenas para operadores qualificados.
          </div>
        </div>
        
        <div class="landing-logo">
          <img src="@/assets/images/cc-logo.png" alt="Duck Hunter Logo" class="landing-logo-image" />
        </div>
      </div>
      
      <div class="bg-elements">
        <div class="radar-sweep"></div>
        <div class="grid-overlay"></div>
      </div>
    </section>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores'

export default {
  name: 'Landing',
  data() {
    return {
      authStore: useAuthStore(),
      videoEnabled: false,
      videoEnded: false
    }
  },
  methods: {
    handleEnlistment() {
      if (this.authStore.isAuthenticated) {
        this.$router.push('/dashboard')
      } else {
        this.$router.push('/login')
      }
    },
    enableVideo() {
      this.videoEnabled = true
      this.videoEnded = false
      this.$nextTick(() => {
        if (this.$refs.huntVideo) {
          this.$refs.huntVideo.play()
        }
      })
    },
    replayVideo() {
      this.videoEnded = false
      if (this.$refs.huntVideo) {
        this.$refs.huntVideo.currentTime = 0
        this.$refs.huntVideo.play()
      }
    },
    onVideoEnded() {
      this.videoEnded = true
    },
  }
}
</script>

<style lang="scss" scoped>
@import './Landing.scss';
</style>