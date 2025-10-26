<template>
    <div class="ranking-table">
        <table class="data-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Localização</th>
              <th>Status</th>
              <th>Custo</th>
              <th>Risco</th>
              <th>Valor</th>
              <th>Prioridade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in analysisStore.ranking" :key="item.id">
              <td class="rank">#{{ index + 1 }}</td>
              <td>
                <div class="location-cell">
                  <div>
                    <span v-if="item.nickname" class="duck-nickname">{{ item.nickname }}</span>
                    <span v-else class="no-nickname">Pato sem apelido</span>
                  </div>
                  <small>{{ item.city }}, {{ item.country }} - {{ item.analysis.distance_km }}km da base</small>
                </div>
              </td>
              <td>
                <StatusBadge :status="item.hibernation_status" />
              </td>
              <td>
                <div class="metric-cell">
                  <div class="mini-bar cost" :style="{ width: item.analysis.operational_cost + '%' }"></div>
                  <span>{{ item.analysis.operational_cost }}%</span>
                </div>
              </td>
              <td>
                <div class="metric-cell">
                  <div class="mini-bar risk" :style="{ width: item.analysis.risk_level + '%' }"></div>
                  <span>{{ item.analysis.risk_level }}%</span>
                </div>
              </td>
              <td>
                <div class="metric-cell">
                  <div class="mini-bar value" :style="{ width: item.analysis.knowledge_gain + '%' }"></div>
                  <span>{{ item.analysis.knowledge_gain }}%</span>
                </div>
              </td>
              <td>
                <span class="priority-badge" :class="getPriorityClass(item.analysis.priority)">
                  {{ item.analysis.priority }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
</template>

<script>
import { getPriorityClass } from '@/utils/priorityClass'
import StatusBadge from '@/components/shared/StatusBadge/StatusBadge.vue'

export default {
    name: 'RankingTable',
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
@import 'RankingTable.scss';
</style>
