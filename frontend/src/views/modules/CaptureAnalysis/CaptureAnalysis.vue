<template>
  <div class="capture-analysis-bi">
    <!-- Header BI Style -->
    <div class="bi-header" id="analysis-header">
      <div class="header-content">
        <h1><img src="@/assets/icons/target.svg" alt="Alvo" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;"> CENTRO DE COMANDO - ANÁLISE ESTRATÉGICA</h1>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalDucks }}</span>
            <span class="stat-label">PATOS CATALOGADOS</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalCountries }}</span>
            <span class="stat-label">PAÍSES ATIVOS</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ avgThreatLevel }}%</span>
            <span class="stat-label">NÍVEL DE AMEAÇA</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado de Carregamento/Erro -->
    <div v-if="!duckStore.ducks || duckStore.ducks.length === 0" class="no-data-state">
      <div class="no-data-card">
        <h3><img src="@/assets/icons/chart.svg" alt="Gráfico" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> SEM DADOS NO MOMENTO</h3>
        <p>Nenhum Pato Primordial catalogado ainda.</p>
        <p>Cadastre alguns patos para visualizar as análises.</p>
      </div>
    </div>

    <template v-else>
      <!-- Mapa Mundial -->
      <WorldMap 
        :ducksByCountry="ducksByCountryCode" 
        :totalDucks="totalDucks"
        :successRate="successRate"
        id="world-map"
      />

      <!-- Gráficos Avançados -->
      <AdvancedCharts 
        :analysisData="analysisStore.statistics" 
        :ducksByCountry="ducksByCountryCode"
        :statusDistribution="statusDistribution"
        id="analysis-charts"
      />
    </template>

    <!-- Dashboard de Métricas -->
    <div class="metrics-dashboard">
      <div class="metric-card high-priority">
        <h3><img src="@/assets/icons/target.svg" alt="Alvo" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> ALVOS CRÍTICOS</h3>
        <div class="metric-value">{{ criticalTargets }}</div>
        <div class="metric-subtitle">Prioridade Máxima</div>
      </div>
      
      <div class="metric-card medium-priority">
        <h3><img src="@/assets/icons/info.svg" alt="Info" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> ALVOS MODERADOS</h3>
        <div class="metric-value">{{ moderateTargets }}</div>
        <div class="metric-subtitle">Prioridade Média</div>
      </div>
      
      <div class="metric-card low-priority">
        <h3><img src="@/assets/icons/chart.svg" alt="Gráfico" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> ALVOS BAIXOS</h3>
        <div class="metric-value">{{ lowTargets }}</div>
        <div class="metric-subtitle">Prioridade Baixa</div>
      </div>
      
      <div class="metric-card success">
        <h3>✅ TAXA DE SUCESSO</h3>
        <div class="metric-value">{{ successRate }}%</div>
        <div class="metric-subtitle">Missões Bem-sucedidas</div>
      </div>
    </div>

    <!-- Top Alvos Prioritários -->
    <BaseCard v-if="analysisStore.statistics?.top_targets && duckStore.ducks?.length > 0" id="analysis-top5" class="priority-card">
      <template #title>
        <img src="@/assets/icons/trophy.svg" alt="Troféu" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> TOP 5 ALVOS ESTRATÉGICOS
      </template>
      <div class="priority-targets-grid">
        <TargetCard 
          v-for="(target, index) in analysisStore.statistics.top_targets" 
          :key="target.id" 
          :target="target" 
          :rank="index + 1"
          class="priority-target-card"
        />
      </div>
    </BaseCard>

    <!-- Controles de Visualização -->
    <div class="view-controls">
      <button 
        @click="currentView = 'overview'" 
        :class="['view-btn', { active: currentView === 'overview' }]"
      >
        <img src="@/assets/icons/chart.svg" alt="Gráfico" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> VISÃO GERAL
      </button>
      <button 
        @click="currentView = 'ranking'" 
        :class="['view-btn', { active: currentView === 'ranking' }]"
      >
        <img src="@/assets/icons/trophy.svg" alt="Troféu" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> RANKING
      </button>
      <button 
        @click="currentView = 'detailed'" 
        :class="['view-btn', { active: currentView === 'detailed' }]"
      >
        <img src="@/assets/icons/magnifier.svg" alt="Lupa" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> ANÁLISE DETALHADA
      </button>
    </div>

    <!-- Conteúdo Baseado na Visualização -->
    <BaseCard :title="getViewTitle()" id="analysis-complete" class="analysis-card" v-if="duckStore.ducks?.length > 0">
      <AnalysisGrid
        v-if="currentView === 'detailed'"
        :analysisStore="analysisStore"
      />

      <RankingTable
        v-else-if="currentView === 'ranking'"
        :analysisStore="analysisStore"
      />
      
      <div v-else class="overview-summary">
        <div class="summary-grid">
          <div class="summary-item">
            <h4><img src="@/assets/icons/money.svg" alt="Dinheiro" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> CUSTO OPERACIONAL MÉDIO</h4>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: (analysisStore.statistics?.avg_operational_cost || 0) + '%' }"></div>
            </div>
            <span>{{ (analysisStore.statistics?.avg_operational_cost || 0).toFixed(1) }}%</span>
          </div>
          
          <div class="summary-item">
            <h4><img src="@/assets/icons/target.svg" alt="Alvo" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> NÍVEL DE RISCO MÉDIO</h4>
            <div class="progress-bar">
              <div class="progress-fill risk" :style="{ width: (analysisStore.statistics?.avg_risk_level || 0) + '%' }"></div>
            </div>
            <span>{{ (analysisStore.statistics?.avg_risk_level || 0).toFixed(1) }}%</span>
          </div>
          
          <div class="summary-item">
            <h4><img src="@/assets/icons/dna.svg" alt="DNA" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> GANHO CIENTÍFICO MÉDIO</h4>
            <div class="progress-bar">
              <div class="progress-fill knowledge" :style="{ width: (analysisStore.statistics?.avg_knowledge_gain || 0) + '%' }"></div>
            </div>
            <span>{{ (analysisStore.statistics?.avg_knowledge_gain || 0).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script>
import { useCaptureAnalysisStore, usePrimordialDuckStore } from '@/stores'
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'
import TargetCard from '@/components/modules/CaptureAnalysis/TargetCard/TargetCard.vue'
import AnalysisGrid from '@/components/modules/CaptureAnalysis/AnalysisGrid/AnalysisGrid.vue'
import RankingTable from '@/components/modules/CaptureAnalysis/RankingTable/RankingTable.vue'
import WorldMap from '@/components/modules/CaptureAnalysis/WorldMap/WorldMap.vue'
import AdvancedCharts from '@/components/modules/CaptureAnalysis/AdvancedCharts/AdvancedCharts.vue'
import { getPriorityClass } from '@/utils/priorityClass'
import { useTour } from '@/composables/useTour'

export default {
  name: 'CaptureAnalysis',
  components: {
    BaseCard,
    TargetCard,
    AnalysisGrid,
    RankingTable,
    WorldMap,
    AdvancedCharts,
  },
  data() {
    return {
      currentView: 'overview',
      analysisStore: useCaptureAnalysisStore(),
      duckStore: usePrimordialDuckStore(),
      ...useTour()
    }
  },
  computed: {
    totalDucks() {
      return this.analysisStore.statistics?.total_ducks || 0
    },
    totalCountries() {
      return Object.keys(this.ducksByCountry).length
    },
    avgThreatLevel() {
      return Math.round(this.analysisStore.statistics?.avg_risk_level || 0)
    },
    ducksByCountry() {
      const countries = {}
      if (this.duckStore.ducks) {
        this.duckStore.ducks.forEach(duck => {
          const country = duck.country || 'Desconhecido'
          countries[country] = (countries[country] || 0) + 1
        })
      }
      return countries
    },
    ducksByCountryCode() {
      const countries = {}

      if (this.duckStore.ducks) {
        this.duckStore.ducks.forEach(duck => {
          const countryCode = duck.country_code || duck.countryCode || 'unknown'
          countries[countryCode] = (countries[countryCode] || 0) + 1
        })
      }
      return countries
    },
    statusDistribution() {
      const distribution = { desperto: 0, em_transe: 0, hibernacao_profunda: 0 }
      if (this.duckStore.ducks) {
        this.duckStore.ducks.forEach(duck => {
          if (distribution.hasOwnProperty(duck.hibernation_status)) {
            distribution[duck.hibernation_status]++
          }
        })
      }
      return distribution
    },
    criticalTargets() {
      if (!this.analysisStore.statistics?.priority_distribution) return 0
      const dist = this.analysisStore.statistics.priority_distribution
      return (dist['Prioridade Máxima'] || 0) + (dist['Alta Prioridade'] || 0)
    },
    moderateTargets() {
      if (!this.analysisStore.statistics?.priority_distribution) return 0
      return this.analysisStore.statistics.priority_distribution['Prioridade Média'] || 0
    },
    lowTargets() {
      if (!this.analysisStore.statistics?.priority_distribution) return 0
      const dist = this.analysisStore.statistics.priority_distribution
      return (dist['Baixa Prioridade'] || 0) + (dist['Não Recomendado'] || 0)
    },
    successRate() {
      const captured = this.duckStore.ducks?.filter(duck => duck.captured).length || 0
      const total = this.duckStore.ducks?.length || 1
      return Math.round((captured / total) * 100)
    }
  },

  async mounted() {
    await Promise.all([
      this.analysisStore.fetchOverview(),
      this.analysisStore.fetchRanking(),
      this.duckStore.fetchDucks()
    ])
    
    this.$nextTick(() => {
      if (this.shouldShowTour('capture-analysis')) {
        this.startTour()
      }
    })
  },
  methods: {
    getPriorityClass,
    getClassification(value) {
      if (value <= 20) return 'Muito Baixo'
      if (value <= 40) return 'Baixo'
      if (value <= 60) return 'Moderado'
      if (value <= 80) return 'Alto'
      return 'Muito Alto'
    },
    startTour() {
      const steps = [
        {
          element: '#analysis-header',
          popover: {
            title: 'Centro de Comando - Análise Estratégica',
            description: 'Esta é a central de comando para análise de captura dos Patos Primordiais. Aqui você encontra métricas estratégicas, mapa mundial e dados de inteligência.'
          }
        },
        {
          element: '#world-map',
          popover: {
            title: 'Mapa Mundial',
            description: 'Visualização avançada com distribuição de patos por país para análise estratégica.'
          }
        },
        {
          element: '#analysis-charts',
          popover: {
            title: 'Gráficos Avançados e Mapa Mundial',
            description: 'Visualizações avançadas incluindo mapa mundial com distribuição de patos por país e gráficos de radar, barras e pizza para análise estratégica.'
          }
        },
        {
          element: '.metrics-dashboard',
          popover: {
            title: 'Dashboard de Métricas',
            description: 'Cards com métricas críticas: Alvos Críticos (prioridade máxima), Alvos Moderados, Alvos Baixos e Taxa de Sucesso das missões.'
          }
        },
        {
          element: '#analysis-top5',
          popover: {
            title: 'Top 5 Alvos Estratégicos',
            description: 'Os 5 patos com melhor relação custo-benefício, ordenados por prioridade de captura baseada no algoritmo de análise da DSIN.'
          }
        },
        {
          element: '.view-controls',
          popover: {
            title: 'Controles de Visualização',
            description: 'Alterne entre diferentes visões: Visão Geral (resumo estratégico), Ranking (ordenação por prioridade) e Análise Detalhada (grid completo).'
          }
        },
        {
          element: '#analysis-complete',
          popover: {
            title: 'Análise Completa',
            description: 'Visualização detalhada baseada na visão selecionada. Cada pato é analisado com métricas de custo operacional, risco, poder militar e ganho científico.'
          }
        }
      ]
      
      const driverObj = this.createDriver(steps, 'capture-analysis')
      driverObj.drive()
    },
    getViewTitle() {
      const titles = {
        overview: 'VISÃO GERAL ESTRATÉGICA',
        ranking: 'RANKING DE PRIORIDADES',
        detailed: 'ANÁLISE DETALHADA'
      }
      return titles[this.currentView] || 'ANÁLISE'
    }
  }
}
</script>

<style scoped lang="scss">
@import './CaptureAnalysis.scss';
</style>