<template>
  <div class="duck-card" :class="{ captured: duck.captured }">
    <div class="duck-photo-section">
      <img :src="getDuckPhotoUrl(duck)" :alt="getDuckPhotoAlt(duck)" class="duck-card-photo" />
    </div>
    <div class="duck-info-section">
      <div class="duck-header">
        <h3 class="duck-nickname">
          <span v-if="duck.nickname" class="nickname">{{ duck.nickname }}</span>
          <span v-else class="no-nickname">Sem apelido</span>
        </h3>
        <div class="action-buttons">
          <div v-if="duck.captured" class="captured-badge">
            <img src="@/assets/icons/target.svg" alt="Target" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> CAPTURADO
          </div>
          <template v-else>
            <button @click="$emit('edit', duck)" class="btn btn-sm btn-secondary">Editar</button>
            <button @click="$emit('delete', duck)" class="btn btn-sm btn-danger">Excluir</button>
          </template>
        </div>
      </div>
      
      <div class="duck-details">
        <div class="detail-row">
          <span class="label"><img src="@/assets/icons/drone.svg" alt="Drone" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Drone:</span>
          <span>{{ duck.brand }} ({{ duck.country_origin }})</span>
        </div>
        
        <div class="detail-row">
          <span class="label"><img src="@/assets/icons/map.svg" alt="map" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Localização:</span>
          <span>{{ duck.city }}, {{ duck.country }}</span>
        </div>
        
        <div class="detail-row">
          <span class="label"><img src="@/assets/icons/compass.svg" alt="compass" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Coordenadas:</span>
          <span>{{ duck.latitude }}, {{ duck.longitude }}</span>
        </div>
        
        <div class="detail-row">
          <span class="label"><img src="@/assets/icons/target.svg" alt="Target" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Precisão GPS:</span>
          <span>{{ formatDimension(duck.gps_precision, duck.precision_unit || 'cm', 'precision') }}</span>
        </div>
        
        <div v-if="duck.capture_chance" class="detail-row">
          <span class="label"><i class="pi pi-bullseye"></i> Chance de Captura:</span>
          <span class="capture-chance" :class="getCaptureChanceClass(duck.capture_chance)">{{ duck.capture_chance }}%</span>
        </div>
        
        <div v-if="duck.reference_point && duck.reference_point !== 'Nenhum'" class="detail-row">
          <span class="label"><img src="@/assets/icons/map-point.svg" alt="map point" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Referência:</span>
          <span>{{ duck.reference_point }}</span>
        </div>
        
        <div class="detail-row">
          <span class="label"><img src="@/assets/icons/measure.svg" alt="measure" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Dimensões:</span>
          <span>
            {{ formatDimension(duck.height, duck.height_unit || 'cm', 'height') }} × 
            {{ formatDimension(duck.weight, duck.weight_unit || 'g', 'weight') }}
          </span>
        </div>
        
        <div class="detail-row">
          <span class="label"><img src="@/assets/icons/info.svg" alt="info" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Status:</span>
          <div class="status-info">
            <StatusBadge :status="duck.hibernation_status" />
            <span v-if="duck.heart_rate_bpm" class="heart-rate">
              <i class="pi pi-heart"></i> {{ duck.heart_rate_bpm }} bpm
            </span>
          </div>
        </div>
        
        <div class="detail-row">
          <span class="label"><img src="@/assets/icons/dna.svg" alt="Drone" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Mutações:</span>
          <span class="mutation-count">{{ duck.mutations_count }}</span>
        </div>
        
        <div v-if="duck.superpower_name" class="detail-row">
          <span class="label"><img src="@/assets/icons/superpower.svg" alt="Superpower" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> Superpoder:</span>
          <div class="superpower-info">
            <div class="superpower-name">{{ duck.superpower_name }}</div>
            <small>{{ duck.superpower_classification }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatusBadge from '@/components/shared/StatusBadge/StatusBadge.vue'
import ppDesconhecido from '@/assets/images/pp-status/pp-desconhecido.png'
import ppDesperto from '@/assets/images/pp-status/pp-desperto.png'
import ppDespertoMutacoes from '@/assets/images/pp-status/pp-desperto-mutacoes.png'
import ppTranse from '@/assets/images/pp-status/pp-transe.png'
import ppHibernacao from '@/assets/images/pp-status/pp-hibernacao.png'

export default {
  name: 'DuckCard',
  components: {
    StatusBadge
  },
  props: {
    duck: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  methods: {
    getDuckPhotoUrl(duck) {
      // Se tem photo_url salva no banco, usar ela
      if (duck.photo_url) {
        const imageMap = {
          'pp-desconhecido.png': ppDesconhecido,
          'pp-desperto.png': ppDesperto,
          'pp-desperto-mutacoes.png': ppDespertoMutacoes,
          'pp-transe.png': ppTranse,
          'pp-hibernacao.png': ppHibernacao
        }
        return imageMap[duck.photo_url] || ppDesconhecido
      }
      
      // Fallback para cálculo dinâmico
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
    getDuckPhotoAlt(duck) {
      const status = duck.hibernation_status
      if (!status) return 'Pato Primordial Desconhecido'
      
      const statusMap = {
        'desperto': duck.mutations_count > 0 ? 'Pato Primordial Desperto com Mutações' : 'Pato Primordial Desperto',
        'em_transe': 'Pato Primordial em Transe',
        'hibernacao_profunda': 'Pato Primordial em Hibernação Profunda'
      }
      return statusMap[status] || 'Pato Primordial Desconhecido'
    },
    formatDimension(value, unit, type) {
      if (!value) return '-'
      
      const unitLabels = {
        height: { cm: 'cm', ft: 'ft' },
        weight: { g: 'g', lb: 'lb' },
        precision: { cm: 'cm', yd: 'yd' }
      }
      
      const formattedValue = typeof value === 'number' ? value.toFixed(2) : value
      const unitLabel = unitLabels[type][unit] || unit
      
      return `${formattedValue}${unitLabel}`
    },
    getCaptureChanceClass(chance) {
      if (chance >= 70) return 'chance-high'
      if (chance >= 40) return 'chance-medium'
      return 'chance-low'
    }
  }
}
</script>

<style scoped lang="scss">
@import './DuckCard.scss';
</style>