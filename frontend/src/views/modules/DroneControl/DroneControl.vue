<template>
  <div class="drone-control">
    <div class="page-header">
      <h1><img src="@/assets/icons/drone.svg" alt="Drone" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;"> Controle do Drone de Captura</h1>
      <p>Sistema avançado de captura de Patos Primordiais</p>
    </div>

    <!-- Status e Bateria -->
    <div id="drone-control-panel">
      <ControlPanel 
        :droneStore="droneStore" 
        :isRecharging="isRecharging" 
        :displayBattery="displayBattery" 
        @openRechargeModal="openRechargeModal" 
      />
    </div>

    <!-- Seletor de Modo de Captura -->
    <BaseCard v-if="!isMobile" id="drone-mode-selector">
      <template #title>
        <img src="@/assets/icons/game.svg" alt="Modo" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Modo de Captura
      </template>
      <div class="capture-mode-selector">
        <label class="mode-switch">
          <input 
            type="checkbox" 
            v-model="advancedMode" 
          />
          <span class="slider"></span>
          <span class="mode-label">
            <span v-if="advancedMode">
              <img src="@/assets/icons/game.svg" alt="Avançado" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> Modo Avançado
            </span>
            <span v-else>
              <img src="@/assets/icons/target.svg" alt="Radar" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> Modo Radar
            </span>
          </span>
        </label>
      </div>
    </BaseCard>

    <!-- Radar de Detecção -->
    <div id="drone-radar" v-if="!advancedMode || isMobile">
      <Radar 
        :availableDucks="availableDucks" 
        @selectTarget="selectTarget" 
      />
    </div>

    <!-- Captura 2D -->
    <div id="drone-capture2d" v-if="advancedMode && !isMobile">
      <Capture2D 
        :availableDucks="availableDucks" 
        @selectTarget="selectTarget" 
      />
    </div>

    <!-- Modal de Confirmação -->
    <HuntModal 
      v-if="showModal" 
      :selectedDuck="selectedDuck" 
      :droneStore="droneStore"
      :strategyChances="strategyChances"
      @close="closeModal" 
      @missionComplete="handleMissionComplete"
    />

    <!-- Resultado da Missão -->
    <MissionResult
      v-if="droneStore.missionResult"
      :missionResult="droneStore.missionResult"
    />

    <!-- Modal de Recarga -->
    <RechargeModal
      v-if="showRechargeModal"
      @close="closeRechargeModal"
      @recharge="rechargeDrone"
    />
  </div>
</template>

<script>
import { useDroneControlStore, usePrimordialDuckStore } from '@/stores'
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'
import ControlPanel from '@/components/modules/DroneControl/ControlPanel/ControlPanel.vue';
import Radar from '@/components/modules/DroneControl/Radar/Radar.vue';
import Capture2D from '@/components/modules/DroneControl/Capture2D/Capture2D.vue';
import HuntModal from '@/components/modules/DroneControl/HuntModal/HuntModal.vue';
import MissionResult from '@/components/modules/DroneControl/MissionResult/MissionResult.vue';
import RechargeModal from '@/components/modules/DroneControl/RechargeModal/RechargeModal.vue';
import { useTour } from '@/composables/useTour'
import { useToast } from 'vue-toastification'

export default {
  name: 'DroneControl',
  components: {
    BaseCard,
    ControlPanel,
    Radar,
    Capture2D,
    HuntModal,
    MissionResult,
    RechargeModal,
  },
  data() {
    return {
      selectedTarget: '',
      selectedDuck: null,
      showModal: false,
      showRechargeModal: false,
      isRecharging: false,
      displayBattery: 0,
      strategyChances: {},
      advancedMode: false,
      isMobile: false,
      droneStore: useDroneControlStore(),
      duckStore: usePrimordialDuckStore(),
      toast: useToast(),
      ...useTour()
    }
  },

  computed: {
    availableDucks() {
      return this.duckStore.ducks.filter(duck => !duck.captured)
    }
  },
  async mounted() {
    // Detectar dispositivos móveis
    this.checkMobileDevice()
    
    // Listener para mudanças no tamanho da tela
    window.addEventListener('resize', this.handleResize)
    
    try {
      await Promise.all([
        this.droneStore.fetchDroneStatus(),
        this.duckStore.fetchDucks(),
        this.droneStore.fetchDefenses(),
        this.droneStore.fetchStrategies()
      ])
      this.displayBattery = this.droneStore.droneStatus?.battery || 0
    } catch (error) {
      // Continuar com valores padrão
      this.displayBattery = 100
    }

    // Iniciar tour se necessário
    this.$nextTick(() => {
      if (this.shouldShowTour('drone-control')) {
        this.startTour()
      }
    })
  },
  watch: {
    'droneStore.droneStatus': {
      handler(newStatus) {
        if (newStatus && !this.isRecharging) {
          this.displayBattery = newStatus.battery || 0
        }
      },
      deep: true,
      immediate: true
    },
    'droneStore.droneStatus.battery': {
      handler(newBattery) {
        if (newBattery !== undefined && !this.isRecharging) {
          this.displayBattery = newBattery
        }
      },
      immediate: true
    },
    advancedMode(newValue) {
      // Se saiu do modo avançado, garantir que qualquer jogo em andamento seja interrompido
      if (!newValue) {
        this.$nextTick(() => {
          // Forçar atualização dos componentes
          this.$forceUpdate()
        })
      }
    }
  },
  methods: {
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
    getRiskClass(risk) {
      const classMap = {
        'Baixo': 'risk-low',
        'Médio': 'risk-medium',
        'Alto': 'risk-high',
        'Muito Alto': 'risk-very-high'
      }
      return classMap[risk] || ''
    },
    async analyzeTarget() {
      if (this.selectedTarget) {
        const analysis = await this.droneStore.analyzeTarget(this.selectedTarget)
        if (analysis && analysis.strategy_chances) {
          this.strategyChances = analysis.strategy_chances
        }
      }
    },
    async selectTarget(duck) {
      // Verifica se tem bateria para pelo menos uma estratégia
      const minEnergyRequired = Math.min(...[25, 45, 35, 20, 40])
      if (this.droneStore.droneStatus?.battery < minEnergyRequired) {
        this.showRechargeModal = true
        return
      }

      this.selectedDuck = duck
      this.selectedTarget = duck.id
      
      // Analisar alvo primeiro para obter chance de captura
      await this.analyzeTarget()
      
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedDuck = null
      this.selectedTarget = ''
      this.strategyChances = [50, 50, 50, 50, 50]
    },
    
    async handleMissionComplete(result) {
      // Atualizar status do drone
      await this.droneStore.fetchDroneStatus()
      
      // Forçar atualização do displayBattery
      this.forceUpdateBattery()
      
      // Atualizar lista de patos disponíveis
      await this.duckStore.fetchDucks()
      
      // Se capturou com sucesso, forçar atualização do radar
      if (result.mission.success) {
        this.$forceUpdate()
      }
    },

    forceUpdateBattery() {
      if (this.droneStore.droneStatus && !this.isRecharging) {
        this.displayBattery = this.droneStore.droneStatus.battery || 0
      }
    },


    openRechargeModal() {
      if (this.droneStore.droneStatus?.battery >= 100) {
        this.toast.info('O drone já possui 100% de energia primordial.')
        return
      }
      this.showRechargeModal = true
    },

    closeRechargeModal() {
      this.showRechargeModal = false
    },

    async rechargeDrone() {
      try {
        this.isRecharging = true
        this.showRechargeModal = false

        // Animar recarga da bateria
        const startBattery = this.droneStore.droneStatus?.battery || 0
        const duration = 3000 // 3 segundos
        const steps = 60
        const increment = (100 - startBattery) / steps

        for (let i = 0; i <= steps; i++) {
          await new Promise(resolve => setTimeout(resolve, duration / steps))
          this.displayBattery = Math.min(100, startBattery + (increment * i))
        }

        // Fazer request para o backend
        try {
          await this.droneStore.rechargeDrone()
          await this.droneStore.fetchDroneStatus()
        } catch (apiError) {
          // Se API falhar, simular recarga local
          this.displayBattery = 100
        }

        this.isRecharging = false
      } catch (error) {
        this.isRecharging = false
        this.displayBattery = 100
      }
    },

    checkMobileDevice() {
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768
      
      // Se mudou para mobile e estava no modo avançado, voltar para radar
      if (this.isMobile && this.advancedMode) {
        this.advancedMode = false
      }
    },

    handleResize() {
      this.checkMobileDevice()
    },
    startTour() {
      const steps = [
        {
          element: '#drone-control-panel',
          popover: {
            title: 'Painel de Controle do Drone',
            description: 'Monitore o status do seu drone de captura: bateria, combustível e integridade. Use o botão de recarga quando necessário.'
          }
        },
        {
          element: '#drone-mode-selector',
          popover: {
            title: 'Seletor de Modo de Captura',
            description: 'Escolha entre Modo Radar (interface simples com lista) ou Modo Avançado 2D (jogo interativo em tempo real).'
          }
        },
        {
          element: this.advancedMode ? '#drone-capture2d' : '#drone-radar',
          popover: {
            title: this.advancedMode ? 'Jogo 2D de Captura' : 'Radar de Detecção',
            description: this.advancedMode 
              ? 'Mini-game 2D: Selecione um pato alvo, controle o drone com WASD/setas, persiga o pato que foge quando você se aproxima. Encoste nele para capturar!'
              : 'Modo Radar: Lista todos os patos disponíveis com informações detalhadas. Clique em "Capturar" para iniciar missão automatizada.'
          }
        }
      ]
      
      const driverObj = this.createDriver(steps, 'drone-control')
      driverObj.drive()
    },
  },
  
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped lang="scss">
@import 'DroneControl.scss';
</style>