<template>
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div v-if="modalStep === 1" class="modal-step">
          <h3><img src="@/assets/icons/target.svg" alt="Alvo" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Alvo Selecionado</h3>
          <div class="target-info" v-if="selectedDuck">
            <div class="duck-header">
              <img :src="getDuckPhotoUrl(selectedDuck)" :alt="selectedDuck.nickname || 'Pato Primordial'" class="duck-photo">
              <h4>{{ selectedDuck.nickname || 'Pato Primordial' }}</h4>
            </div>
            <div class="target-details">
              <div class="detail-item">
                <strong>Localização:</strong> {{ selectedDuck.city }}, {{ selectedDuck.country }}
              </div>
              <div class="detail-item">
                <strong>Status:</strong>
                <span class="status-badge" :class="getStatusClass(selectedDuck.hibernation_status)">
                  {{ formatStatus(selectedDuck.hibernation_status) }}
                </span>
              </div>
              <div class="detail-item">
                <strong>Dimensões:</strong> {{ selectedDuck.height }}{{ selectedDuck.height_unit || 'cm' }} × {{ selectedDuck.weight }}{{ selectedDuck.weight_unit || 'g' }}
              </div>
              <div class="detail-item">
                <strong>Mutações:</strong> {{ selectedDuck.mutations_count }}
              </div>
              <div v-if="selectedDuck.superpower_name" class="detail-item">
                <strong>Superpoder:</strong> {{ selectedDuck.superpower_name }}
              </div>
            </div>
          </div>
          <div class="modal-warning">
            <img src="@/assets/icons/info.svg" alt="Aviso" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> Esta é uma operação extremamente perigosa. Deseja prosseguir?
          </div>
          <div class="modal-actions">
            <button @click="$emit('close')" class="btn btn-secondary">Cancelar</button>
            <button @click="proceedToStrategy" class="btn btn-danger">Prosseguir</button>
          </div>
        </div>
        
        <div v-if="modalStep === 2" class="modal-step">
          <h3><img src="@/assets/icons/target.svg" alt="Estratégia" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Selecione a Estratégia de Captura</h3>
          <div class="strategy-selector">
            <BaseInput
              id="strategy-select"
              v-model="selectedStrategy"
              type="select"
              class="strategy-select"
            >
              <option value="null">Escolha uma estratégia...</option>
              <option value="0" :disabled="!canUseStrategy(0)">Ataque Furtivo {{ !canUseStrategy(0) ? '(Sem bateria)' : '' }}</option>
              <option value="1" :disabled="!canUseStrategy(1)">Bombardeio Aéreo {{ !canUseStrategy(1) ? '(Sem bateria)' : '' }}</option>
              <option value="2" :disabled="!canUseStrategy(2)">Captura com Rede {{ !canUseStrategy(2) ? '(Sem bateria)' : '' }}</option>
              <option value="3" :disabled="!canUseStrategy(3)">Distração Sonora {{ !canUseStrategy(3) ? '(Sem bateria)' : '' }}</option>
              <option value="4" :disabled="!canUseStrategy(4)">Ataque Elétrico {{ !canUseStrategy(4) ? '(Sem bateria)' : '' }}</option>
            </BaseInput>
          </div>
          
          <div v-if="selectedStrategy !== null && selectedStrategy !== 'null'" class="strategy-info">
            <div class="strategy-details">
              <h4>{{ getStrategyName(selectedStrategy) }}</h4>
              <p>{{ getStrategyDescription(selectedStrategy) }}</p>
              
              <div class="success-chances">
                <div class="chance-item capture">
                  <span class="chance-label">Chance de Captura:</span>
                  <span class="chance-value capture-chance" :class="getCaptureChanceClass(getCurrentCaptureChance())">
                    {{ getCurrentCaptureChance() }}%
                  </span>
                </div>
                <div class="chance-item failure">
                  <span class="chance-label">Chance de Fracasso:</span>
                  <span class="chance-value">{{ 100 - getCurrentCaptureChance() }}%</span>
                </div>
                <div class="chance-item energy">
                  <span class="chance-label">Energia Necessária:</span>
                  <span class="chance-value">{{ getEnergyRequired(selectedStrategy) }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="modalStep = 1" class="btn btn-secondary">Voltar</button>
            <button 
              @click="executeMission" 
              :disabled="selectedStrategy === null || selectedStrategy === 'null' || !droneStore.droneStatus?.operational"
              class="btn btn-danger"
            >
              Tentar Captura
            </button>
          </div>
        </div>
        
        <div v-if="modalStep === 3" class="modal-step">
          <div v-if="missionLoading" class="mission-loading">
            <h3><img src="@/assets/icons/drone.svg" alt="Drone" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Executando Missão...</h3>
            <div class="loading-animation">
              <img :src="duckCaptureGif" alt="Pato fugindo" class="duck-gif" />
            </div>
            <p>O pato está tentando escapar!</p>
          </div>
          
          <div v-else-if="missionResult">
            <h3>
              <span v-if="missionResult.mission.success">
                <img src="@/assets/icons/trophy.svg" alt="Sucesso" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Missão Bem-Sucedida!
              </span>
              <span v-else>
                Missão Falhou!
              </span>
            </h3>
            <div class="mission-summary">
              <div class="mission-video">
                <video 
                  :src="getMissionVideo()" 
                  autoplay 
                  loop 
                  class="mission-capture-video"
                >
                  Seu navegador não suporta vídeos.
                </video>
              </div>
              <div class="result-icon">
                <img v-if="missionResult.mission.success" src="@/assets/icons/trophy.svg" alt="Troféu" style="width: 32px; height: 32px;">
                <span v-else style="font-size: 2rem;">😢</span>
              </div>
              <p class="result-message">{{ missionResult.mission.result_message }}</p>
              <div v-if="missionResult.mission.success" class="success-details">
                <p><strong>Pato capturado com sucesso!</strong></p>
                <p>Estratégia: {{ missionResult.strategy_used.name }}</p>
              </div>
            </div>
            <div class="modal-actions">
              <button @click="$emit('close')" class="btn btn-primary">
                <img src="@/assets/icons/trophy.svg" alt="Concluir" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> Concluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import BaseInput from '@/components/shared/BaseInput/BaseInput.vue'
import { useToast } from 'vue-toastification'

import stealthVideo from '@/assets/duck-capture-videos/stealth.mp4'
import bombVideo from '@/assets/duck-capture-videos/bomb.mp4'
import netVideo from '@/assets/duck-capture-videos/net.mp4'
import soundVideo from '@/assets/duck-capture-videos/sound.mp4'
import electricVideo from '@/assets/duck-capture-videos/electric.mp4'
import defeatVideo from '@/assets/duck-capture-videos/defeat.mp4'
import duckCaptureGif from '@/assets/images/duck-capture.gif'
import ppDesconhecido from '@/assets/images/pp-status/pp-desconhecido.png'
import ppDesperto from '@/assets/images/pp-status/pp-desperto.png'
import ppDespertoMutacoes from '@/assets/images/pp-status/pp-desperto-mutacoes.png'
import ppTranse from '@/assets/images/pp-status/pp-transe.png'
import ppHibernacao from '@/assets/images/pp-status/pp-hibernacao.png'

export default {
    name: 'HuntModal',
    components: {
        BaseInput
    },
    emits: ['close', 'missionComplete'],
    props: {
        selectedDuck: {
            type: Object,
            required: true,
        },
        droneStore: {
            type: Object,
            required: true,
        },
        strategyChances: {
            type: Array,
            default: () => [50, 50, 50, 50, 50]
        },
    },
    data() {
        return {
            modalStep: 1,
            selectedStrategy: null,
            missionResult: null,
            missionLoading: false,
            duckCaptureGif,
            toast: useToast()
        }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
        getDuckPhotoUrl(duck) {
            const hibernationStatus = duck.hibernation_status
            const mutationsCount = duck.mutations_count
            
            if (!hibernationStatus) {
                return ppDesconhecido
            }
            
            switch (hibernationStatus) {
                case 'desperto':
                    return mutationsCount > 0 ? ppDespertoMutacoes : ppDesperto
                case 'em_transe':
                    return ppTranse
                case 'hibernacao_profunda':
                    return ppHibernacao
                default:
                    return ppDesconhecido
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
        proceedToStrategy() {
            this.modalStep = 2
        },
        getStrategyName(index) {
            const strategies = [
                'Ataque Furtivo',
                'Bombardeio Aéreo', 
                'Captura com Rede',
                'Distração Sonora',
                'Ataque Elétrico'
            ]
            return strategies[index] || 'Estratégia Desconhecida'
        },
        getStrategyDescription(index) {
            const descriptions = [
                'Aproximação silenciosa pelas costas do alvo',
                'Ataque direto com explosivos de alta potência',
                'Captura usando rede eletromagnética',
                'Confundir o alvo com sons de alta frequência',
                'Descarga elétrica para paralisar temporariamente'
            ]
            return descriptions[index] || 'Descrição não disponível'
        },
        getSuccessRate(index) {
            const rates = [85, 65, 75, 55, 70]
            return rates[index] || 50
        },
        getEnergyRequired(index) {
            const energy = [25, 45, 35, 20, 40]
            return energy[index] || 30
        },
        getCaptureChanceClass(chance) {
            if (chance >= 70) return 'high-chance'
            if (chance >= 40) return 'medium-chance'
            return 'low-chance'
        },
        getCurrentCaptureChance() {
            if (this.selectedStrategy === null || this.selectedStrategy === 'null') return 0
            return this.strategyChances[parseInt(this.selectedStrategy)] || 0
        },
        canUseStrategy(index) {
            return this.droneStore.droneStatus.battery >= this.getEnergyRequired(index)
        },
        async executeMission() {
            if (!this.selectedDuck || this.selectedStrategy === null || this.selectedStrategy === 'null') return

            try {
                this.modalStep = 3
                this.missionLoading = true

                // Executar missão
                const result = await this.droneStore.executeMission(this.selectedDuck.id, parseInt(this.selectedStrategy))

                // Aguardar 4 segundos para o loading
                await new Promise(resolve => setTimeout(resolve, 4000))

                this.missionLoading = false
                this.missionResult = result

                // Forçar atualização do status do drone
                await this.droneStore.fetchDroneStatus()

                // Emitir evento para o componente pai
                this.$emit('missionComplete', result)
            } catch (error) {
                this.toast.error('Erro na execução da missão')
                this.missionLoading = false
            }
        },
        getMissionVideo() {
            if (!this.missionResult) return ''

            const success = this.missionResult.mission.success
            const strategyIndex = parseInt(this.selectedStrategy)

            if (!success) {
                return defeatVideo
            }

            const videoMap = {
                0: stealthVideo,     // Ataque Furtivo
                1: bombVideo,        // Bombardeio Aéreo
                2: netVideo,         // Captura com Rede
                3: soundVideo,       // Distração Sonora
                4: electricVideo     // Ataque Elétrico
            }

            return videoMap[strategyIndex] || stealthVideo
        }
    },
};
</script>

<style scoped lang="scss">
@import 'HuntModal.scss';
</style>
