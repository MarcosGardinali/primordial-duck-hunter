<template>
    <div v-if="!showRanking" class="analysis-grid">
        <div v-for="analysis in analysisStore.analyses" :key="analysis.id" class="analysis-card">
          <div class="analysis-header">
            <h4>
              <span v-if="analysis.nickname" class="duck-nickname">{{ analysis.nickname }}</span>
              <span v-else class="no-nickname">Pato sem apelido</span>
              <br>
              <small class="location-text">{{ analysis.city }}, {{ analysis.country }}</small>
            </h4>
            <StatusBadge :status="analysis.hibernation_status" />
          </div>
          
          <div class="analysis-metrics">
            <div class="metric-row">
              <span>Custo Operacional:</span>
              <div class="metric-visual">
                <div class="progress-bar">
                  <div class="progress-fill cost" :style="{ width: analysis.analysis.operational_cost + '%' }"></div>
                </div>
                <span>{{ analysis.analysis.operational_cost }}%</span>
              </div>
            </div>
            <div class="metric-row">
              <span>Poderio Militar:</span>
              <div class="metric-visual">
                <div class="progress-bar">
                  <div class="progress-fill theme" :style="{ width: analysis.analysis.military_power + '%' }"></div>
                </div>
                <span>{{ analysis.analysis.military_power }}%</span>
              </div>
            </div>
            <div class="metric-row">
              <span>Nível de Risco:</span>
              <div class="metric-visual">
                <div class="progress-bar">
                  <div class="progress-fill risk" :style="{ width: analysis.analysis.risk_level + '%' }"></div>
                </div>
                <span>{{ analysis.analysis.risk_level }}%</span>
              </div>
            </div>
            <div class="metric-row">
              <span>Ganho Científico:</span>
              <div class="metric-visual">
                <div class="progress-bar">
                  <div class="progress-fill value" :style="{ width: analysis.analysis.knowledge_gain + '%' }"></div>
                </div>
                <span>{{ analysis.analysis.knowledge_gain }}%</span>
              </div>
            </div>
          </div>

          <div class="analysis-footer">
            <span class="priority-badge" :class="getPriorityClass(analysis.analysis.priority)">
              {{ analysis.analysis.priority }}
            </span>
            <span class="distance">{{ analysis.analysis.distance_km }}km da base</span>
          </div>
        </div>
      </div>
</template>

<script>
import StatusBadge from '@/components/shared/StatusBadge/StatusBadge.vue'
import { getPriorityClass } from '@/utils/priorityClass'

export default {
    name: 'AnalysisGrid',
    components: {
        StatusBadge,
    },
    props: {
        analysisStore: {
			type: Object,
			required: true,
		},
    },
    methods: {
        getPriorityClass,
    },
};
</script>

<style scoped lang="scss">
@import 'AnalysisGrid.scss';
</style>
