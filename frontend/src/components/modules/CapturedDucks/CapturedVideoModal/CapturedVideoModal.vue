<template>
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🎬 Vídeo da Captura</h3>
          <button @click="closeVideoModal" class="close-btn">×</button>
        </div>
        <div class="video-container" v-if="selectedDuck">
          <h4>{{ selectedDuck.nickname || 'Pato Primordial' }}</h4>
          <p><strong>Estratégia:</strong> {{ selectedDuck.capture_strategy }}</p>
          <div class="capture-video-wrapper">
            <video 
              :src="getCaptureVideoUrl(selectedDuck.capture_strategy)" 
              autoplay 
              loop 
              class="capture-video"
            >
              Seu navegador não suporta vídeos.
            </video>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    name: 'CapturedVideoModal',
	  emits: ['close'],
    props: {
        selectedDuck: {
            type: Object,
            required: true
        }
    },
    methods: {
        closeVideoModal() {
            this.$emit('close')
        },
        getCaptureVideoUrl(strategy) {
            const videoMap = {
                'Ataque Furtivo': '/src/assets/duck-capture-videos/stealth.mp4',
                'Bombardeio Aéreo': '/src/assets/duck-capture-videos/bomb.mp4',
                'Captura com Rede': '/src/assets/duck-capture-videos/net.mp4',
                'Distração Sonora': '/src/assets/duck-capture-videos/sound.mp4',
                'Ataque Elétrico': '/src/assets/duck-capture-videos/electric.mp4'
            }
            return videoMap[strategy] || '/src/assets/duck-capture-videos/stealth.mp4'
        }
    },
};
</script>

<style scoped lang="scss">
@import 'CapturedVideoModal.scss';
</style>
