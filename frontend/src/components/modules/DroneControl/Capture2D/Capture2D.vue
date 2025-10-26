<template>
  <BaseCard title="🎮 Captura Avançada">
    <!-- Overlay de Seleção de Alvo -->
    <div v-if="!selectedDuck" class="target-selection-overlay">
      <h3><img src="@/assets/icons/target.svg" alt="Target" style="width: 32px; height: 32px; vertical-align: middle; margin-right: 8px;"> Selecione seu Alvo</h3>
      <div class="duck-grid">
        <div 
          v-for="duck in availableDucks" 
          :key="duck.id"
          class="duck-card"
          :class="getStatusClass(duck.hibernation_status)"
          @click="selectDuck(duck)"
        >
          <div class="duck-photo">
            <img 
              v-if="getDuckPhoto(duck)" 
              :src="getDuckPhoto(duck)" 
              :alt="duck.nickname || 'Pato Primordial'"
              class="duck-image"
              @error="handleImageError"
            >
            <img 
              v-else
              src="@/assets/icons/duck.svg" 
              alt="Duck" 
              class="duck-icon"
            >
          </div>
          <div class="duck-name">{{ duck.nickname || 'Pato Primordial' }}</div>
          <div class="duck-status">{{ formatStatus(duck.hibernation_status) }}</div>
        </div>
      </div>
      
      <div class="controls-info">
        <h4>🎮 Controles do Drone</h4>
        <div class="controls-grid">
          <div class="control-item">↑ ou W: Mover para cima</div>
          <div class="control-item">↓ ou S: Mover para baixo</div>
          <div class="control-item">← ou A: Mover para a esquerda</div>
          <div class="control-item">→ ou D: Mover para a direita</div>
        </div>
      </div>
    </div>

    <!-- Área de Captura 2D -->
    <div v-else class="capture-area" :style="{ backgroundImage: `url(${currentBackground})` }" tabindex="0" @keydown="handleKeyDown" @keyup="handleKeyUp" ref="gameArea">
      <div class="game-info">
        <div class="target-info">
          <strong><img src="@/assets/icons/target.svg" alt="Target" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Alvo: {{ selectedDuck.nickname || 'Pato Primordial' }}</strong>
          <button @click="resetSelection" class="btn-reset">Trocar Alvo</button>
        </div>
        <div class="game-status">Clique na área do jogo para ativar controles</div>
      </div>
      
      <div 
        class="drone neon-blue" 
        :style="{ left: drone.x + 'px', top: drone.y + 'px' }"
      >
        <img src="@/assets/icons/drone.svg" alt="Drone" style="width: 32px; height: 32px;">
      </div>
      
      <div 
        class="duck-target neon-red" 
        :style="{ left: duck.x + 'px', top: duck.y + 'px' }"
      >
        <img 
          src="@/assets/icons/duck.svg" 
          alt="Duck" 
          class="duck-target-icon"
        >
      </div>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'

export default {
  name: 'Capture2D',
  components: {
    BaseCard,
  },
  emits: ['selectTarget'],
  props: {
    availableDucks: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedDuck: null,
      drone: { x: 50, y: 120 },
      duck: { x: 200, y: 200 },
      gameArea: { width: 600, height: 400 },
      gameLoop: null,
      droneSpeed: 8,
      keysPressed: new Set(),
      backgrounds: [
        '/src/assets/images/Capture2DLayer/1.jpg',
        '/src/assets/images/Capture2DLayer/2.jpg',
        '/src/assets/images/Capture2DLayer/3.jpg',
        '/src/assets/images/Capture2DLayer/4.jpg',
        '/src/assets/images/Capture2DLayer/5.jpg',
        '/src/assets/images/Capture2DLayer/6.jpg',
        '/src/assets/images/Capture2DLayer/7.jpg',
        '/src/assets/images/Capture2DLayer/8.jpg',
        '/src/assets/images/Capture2DLayer/9.jpg',
        '/src/assets/images/Capture2DLayer/10.jpg',
        '/src/assets/images/Capture2DLayer/11.jpg',
      ],
      currentBackground: '',
      lastBackground: '',
    }
  },
  mounted() {
    this.setRandomBackground()
  },
  methods: {
    setRandomBackground() {
      let newBackground
      do {
        newBackground = this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)]
      } while (newBackground === this.lastBackground && this.backgrounds.length > 1)
      
      this.lastBackground = this.currentBackground
      this.currentBackground = newBackground
    },
    selectDuck(duck) {
      this.selectedDuck = duck
      this.setRandomBackground()
      this.resetPositions()
      this.startGame()
    },
    resetSelection() {
      this.selectedDuck = null
      this.stopGame()
    },
    resetPositions() {
      this.drone = { x: 50, y: 120 }
      
      // Garantir que o pato nasça longe do drone (mínimo 200px de distância)
      let duckX, duckY, distance
      do {
        duckX = Math.random() * (this.gameArea.width - 70) + 20
        duckY = Math.random() * (this.gameArea.height - 150) + 100
        distance = Math.sqrt((duckX - this.drone.x) ** 2 + (duckY - this.drone.y) ** 2)
      } while (distance < 200)
      
      this.duck = { 
        x: duckX,
        y: duckY,
        direction: Math.random() * 2 * Math.PI,
        changeDirectionCounter: 0
      }
    },
    startGame() {
      this.gameLoop = setInterval(() => {
        this.moveDuck()
        this.updateDronePosition()
        this.checkCollision()
      }, 50)
      this.$nextTick(() => {
        this.$refs.gameArea?.focus()
        document.addEventListener('keyup', this.handleKeyUp)
      })
    },
    stopGame() {
      if (this.gameLoop) {
        clearInterval(this.gameLoop)
        this.gameLoop = null
      }
      this.keysPressed.clear()
      document.removeEventListener('keyup', this.handleKeyUp)
    },
    moveDuck() {
      if (!this.duck.direction) {
        this.duck.direction = Math.random() * 2 * Math.PI
        this.duck.changeDirectionCounter = 0
      }
      
      const speed = 3
      
      // Calcular distância do drone
      const dx = this.drone.x - this.duck.x
      const dy = this.drone.y - this.duck.y
      const distanceToDrone = Math.sqrt(dx * dx + dy * dy)
      
      // Se o drone estiver muito perto (menos de 120px), tentar fugir
      if (distanceToDrone < 120) {
        // Direção oposta ao drone (fugir)
        const escapeDirection = Math.atan2(-dy, -dx)
        // Misturar 70% fuga + 30% movimento aleatório para não ficar impossível
        this.duck.direction = escapeDirection + (Math.random() - 0.5) * 0.6
        this.duck.changeDirectionCounter = 0
      } else {
        // Comportamento normal - mudar direção ocasionalmente
        this.duck.changeDirectionCounter++
        if (this.duck.changeDirectionCounter > 30 + Math.random() * 60) {
          this.duck.direction = Math.random() * 2 * Math.PI
          this.duck.changeDirectionCounter = 0
        }
      }
      
      let newX = this.duck.x + Math.cos(this.duck.direction) * speed
      let newY = this.duck.y + Math.sin(this.duck.direction) * speed
      
      const marginLeft = 10
      const marginRight = 50
      const marginTop = 100
      const marginBottom = 50
      
      if (newX <= marginLeft || newX >= this.gameArea.width - marginRight) {
        this.duck.direction = Math.PI - this.duck.direction
        newX = Math.max(marginLeft, Math.min(this.gameArea.width - marginRight, newX))
      }
      if (newY <= marginTop || newY >= this.gameArea.height - marginBottom) {
        this.duck.direction = -this.duck.direction
        newY = Math.max(marginTop, Math.min(this.gameArea.height - marginBottom, newY))
      }
      
      this.duck.x = newX
      this.duck.y = newY
    },
    handleKeyDown(event) {
      const { key } = event
      this.keysPressed.add(key.toLowerCase())
      event.preventDefault()
    },
    handleKeyUp(event) {
      const { key } = event
      this.keysPressed.delete(key.toLowerCase())
      event.preventDefault()
    },
    updateDronePosition() {
      let newX = this.drone.x
      let newY = this.drone.y
      
      if (this.keysPressed.has('arrowup') || this.keysPressed.has('w')) {
        newY -= this.droneSpeed
      }
      if (this.keysPressed.has('arrowdown') || this.keysPressed.has('s')) {
        newY += this.droneSpeed
      }
      if (this.keysPressed.has('arrowleft') || this.keysPressed.has('a')) {
        newX -= this.droneSpeed
      }
      if (this.keysPressed.has('arrowright') || this.keysPressed.has('d')) {
        newX += this.droneSpeed
      }
      
      const marginLeft = 10
      const marginRight = 50
      const marginTop = 100
      const marginBottom = 50
      
      this.drone.x = Math.max(marginLeft, Math.min(this.gameArea.width - marginRight, newX))
      this.drone.y = Math.max(marginTop, Math.min(this.gameArea.height - marginBottom, newY))
    },
    checkCollision() {
      const dx = this.drone.x - this.duck.x
      const dy = this.drone.y - this.duck.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 30) {
        this.stopGame()
        this.$emit('selectTarget', this.selectedDuck)
        this.resetSelection()
      }
    },
    formatStatus(status) {
      const statusMap = {
        'desperto': 'Desperto',
        'em_transe': 'Em Transe',
        'hibernacao_profunda': 'Hibernação'
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      const classMap = {
        'desperto': 'status-awake',
        'em_transe': 'status-trance',
        'hibernacao_profunda': 'status-hibernation'
      }
      return classMap[status] || ''
    },
    getDuckPhoto(duck) {
      return duck.photo_url
    },
    handleImageError(event) {
      event.target.src = '/src/assets/icons/duck.svg'
      event.target.classList.add('duck-icon')
      event.target.classList.remove('duck-image')
    },
  },
  watch: {
    '$parent.isMobile'(newValue) {
      if (newValue) {
        this.resetSelection()
      }
    }
  },
  beforeUnmount() {
    this.stopGame()
    document.removeEventListener('keyup', this.handleKeyUp)
  }
}
</script>

<style scoped lang="scss">
@import 'Capture2D.scss';
</style>