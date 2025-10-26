<template>
  <div class="table-card">
    <div class="card-header">
      <div class="header-left">
        <h3><img src="@/assets/icons/duck.svg" alt="Duck" style="width: 32px; height: 32px; vertical-align: middle; margin-right: 8px;"> Últimos Patos Catalogados</h3>
        <p class="subtitle-light">Últimos 10 Patos Primordiais descobertos</p>
      </div>
    </div>
    
    <div class="table-container responsive-table scroll-container">
      <table class="users-table military-table-style">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Apelido</th>
            <th>Localização</th>
            <th>Status</th>
            <th>Descoberto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="duck in ducks" :key="duck.id" class="table-row">
            <td>
              <div class="duck-photo">
                <img :src="getDuckPhotoUrl(duck)" :alt="duck.nickname || 'Pato'" class="duck-avatar-img" />
              </div>
            </td>
            <td>
              <span v-if="duck.nickname" class="nickname">{{ duck.nickname }}</span>
              <span v-else class="no-nickname">Sem apelido</span>
            </td>
            <td>{{ duck.city }}, {{ duck.country }}</td>
            <td>
              <StatusBadge :status="duck.hibernation_status" />
            </td>
            <td>{{ formatDate(duck.discovered_at) }}</td>
            <td>
              <div class="action-buttons">
                <div v-if="duck.captured" class="captured-indicator">
                  <img src="@/assets/icons/target.svg" alt="Target" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> CAPTURADO
                </div>
                <button v-else @click="$emit('edit-duck', duck.id)" class="action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
  name: 'DuckTable',
  components: {
    StatusBadge
  },
  props: {
    ducks: {
      type: Array,
      default: () => []
    }
  },
  emits: ['edit-duck'],
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
    formatDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)
      
      if (diffMins < 60) return `${diffMins} min atrás`
      if (diffHours < 24) return `${diffHours}h atrás`
      return `${diffDays} dias atrás`
    }
  }
}
</script>

<style scoped lang="scss">
@import './DuckTable.scss';
</style>