<template>
  <div class="target-card">
    <div class="target-rank">#{{ rank }}</div>
    <div class="target-info">
      <h4>
        <span v-if="target.nickname" class="duck-nickname">{{ target.nickname }}</span>
        <span v-else class="no-nickname">Pato sem apelido</span>
      </h4>
      <div class="target-location">📍 {{ target.city }}, {{ target.country }}</div>
      <div class="target-details">
        <span class="status-badge" :class="getStatusClass(target.hibernation_status)">
          {{ formatStatus(target.hibernation_status) }}
        </span>
        <span class="mutations">{{ target.mutations_count }} mutações</span>
        <span v-if="target.superpower_name" class="superpower"><img src="@/assets/icons/superpower.svg" alt="Superpower" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 4px;"> {{ target.superpower_name }}</span>
      </div>
    </div>
    <div class="target-metrics">
      <div class="metric">
        <span class="metric-label">Custo</span>
        <div class="metric-bar">
          <div class="metric-fill cost" :style="{ width: target.analysis.operational_cost + '%' }"></div>
        </div>
        <span class="metric-value">{{ target.analysis.operational_cost }}%</span>
      </div>
      <div class="metric">
        <span class="metric-label">Risco</span>
        <div class="metric-bar">
          <div class="metric-fill risk" :style="{ width: target.analysis.risk_level + '%' }"></div>
        </div>
        <span class="metric-value">{{ target.analysis.risk_level }}%</span>
      </div>
      <div class="metric">
        <span class="metric-label">Valor</span>
        <div class="metric-bar">
          <div class="metric-fill value" :style="{ width: target.analysis.knowledge_gain + '%' }"></div>
        </div>
        <span class="metric-value">{{ target.analysis.knowledge_gain }}%</span>
      </div>
    </div>
    <div class="target-priority">
      <span class="priority-badge" :class="getPriorityClass(target.analysis.priority)">
        {{ target.analysis.priority }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TargetCard',
  props: {
    target: {
      type: Object,
      required: true
    },
    rank: {
      type: Number,
      required: true
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
    getPriorityClass(priority) {
      const classMap = {
        'Prioridade Máxima': 'priority-max',
        'Alta Prioridade': 'priority-high',
        'Prioridade Média': 'priority-medium',
        'Baixa Prioridade': 'priority-low',
        'Não Recomendado': 'priority-none'
      }
      return classMap[priority] || ''
    }
  }
}
</script>

<style scoped lang="scss">
@import './TargetCard.scss';
</style>