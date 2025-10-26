<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <h1>Visão Geral</h1>
        <p>Acompanhe o desempenho da sua plataforma</p>
      </div>
    </div>
    
    <div class="stats-grid card-grid" id="dashboard-stats">
      <StatCard
        title="Patos Catalogados"
        :value="duckStore.stats?.total || 0"
        icon="duck.svg"
        variant="primary"
        change-text="Missão em andamento"
        change-type="positive"
      />
      
      <StatCard
        title="Em Hibernação"
        :value="getStatusCount('hibernacao_profunda')"
        icon="sleep.svg"
        variant="success"
        change-text="Seguros para captura"
        change-type="positive"
      />
      
      <StatCard
        title="Em Transe"
        :value="getStatusCount('em_transe')"
        icon="trance.svg"
        variant="info"
        change-text="Médio risco"
        change-type="positive"
      />
      
      <StatCard
        title="Despertos"
        :value="getStatusCount('desperto')"
        icon="superpower.svg"
        variant="danger"
        change-text="Alto risco"
        change-type="negative"
      />
      
      <StatCard
        title="Mutações Médias"
        :value="formatAvgMutations()"
        icon="dna.svg"
        variant="info"
        change-text="Valor científico"
        change-type="positive"
      />
    </div>
    
    <div class="charts-grid">
      <ChartCard
        subtitle="Mapa interativo com todos os patos catalogados"
        :is-map="true"
        id="dashboard-map"
      >
        <template #title>
          <img src="@/assets/icons/map.svg" alt="Mapa" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Localização dos Patos
        </template>
        <DashboardMap :ducks="duckStore.ducks || []" @duck-selected="onDuckSelected" />
      </ChartCard>
      
      <ChartCard title="Distribuição por Status" id="dashboard-chart">
        <BarChart v-if="duckStore.stats?.by_status" :key="'bar-' + (duckStore.stats?.total || 0)" :chart-data="chartData" />
        <div v-else class="loading-message">Carregando dados...</div>
      </ChartCard>
    </div>
    
    <div class="charts-grid">
      <ChartCard>
        <template #title>
          <img src="@/assets/icons/chart.svg" alt="Gráfico" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Patos Catalogados (últimos 7 dias)
        </template>
        <LineChart v-if="duckStore.stats?.last_7_days?.length >= 0" :key="'line-' + (duckStore.stats?.last_7_days?.length || 0)" :chart-data="lineChartData" />
        <div v-else class="loading-message">Carregando dados...</div>
      </ChartCard>
    </div>
    
    <div id="dashboard-table">
      <DuckTable :ducks="duckStore.stats?.recent_ducks || []" @edit-duck="editDuck" />
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/shared/Charts/LineChart.vue'
import BarChart from '@/components/shared/Charts/BarChart.vue'
import DashboardMap from '@/components/modules/Dashboard/DashboardMap/DashboardMap.vue'
import StatCard from '@/components/modules/Dashboard/StatCard/StatCard.vue'
import ChartCard from '@/components/modules/Dashboard/ChartCard/ChartCard.vue'
import DuckTable from '@/components/modules/Dashboard/DuckTable/DuckTable.vue'
import { usePrimordialDuckStore } from '@/stores'
import { useTour } from '@/composables/useTour'

export default {
  name: 'Dashboard',
  components: {
    LineChart,
    BarChart,
    DashboardMap,
    StatCard,
    ChartCard,
    DuckTable
  },
  data() {
    return {
      duckStore: usePrimordialDuckStore(),
      ...useTour()
    }
  },
  computed: {
    chartData() {
      const hibernacao = this.getStatusCount('hibernacao_profunda')
      const transe = this.getStatusCount('em_transe')
      const desperto = this.getStatusCount('desperto')
      
      return {
        labels: ['Status'],
        datasets: [
          {
            label: 'Hibernação',
            data: [hibernacao],
            backgroundColor: '#10b981'
          },
          {
            label: 'Transe',
            data: [transe],
            backgroundColor: '#3b82f6'
          },
          {
            label: 'Despertos',
            data: [desperto],
            backgroundColor: '#ef4444'
          }
        ]
      }
    },
    lineChartData() {
      const labels = []
      const data = []
      
      // Criar array dos últimos 7 dias
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' })
        
        labels.push(dayName)
        
        // Buscar dados do dia, comparando apenas a data
        const dayData = this.duckStore.stats?.last_7_days?.find(d => {
          const dbDate = new Date(d.date).toISOString().split('T')[0]
          return dbDate === dateStr
        })
        
        const count = dayData ? parseInt(dayData.count) : 0
        data.push(count)
      }
      
      return {
        labels,
        datasets: [{
          label: 'Patos Catalogados',
          data,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true
        }]
      }
    }
  },
  async mounted() {
    try {
      // Carregar todos os dados em uma única requisição
      await this.duckStore.fetchCompleteData()
    } catch (error) {
    }
    
    window.editDuck = (duckId) => {
      this.$router.push(`/primordial-ducks?edit=${duckId}`)
    }

    // Iniciar tour se necessário
    this.$nextTick(() => {
      if (this.shouldShowTour('dashboard')) {
        this.startTour()
      }
    })
  },
  beforeUnmount() {
    delete window.editDuck
  },
  watch: {
    'duckStore.stats': {
      handler(newStats) {
        this.$forceUpdate()
      },
      deep: true
    },

  },

  methods: {
    getStatusCount(status) {
      if (!this.duckStore.stats?.by_status) return 0
      const statusData = this.duckStore.stats.by_status.find(s => s.hibernation_status === status)
      return statusData ? statusData.count : 0
    },
    onDuckSelected(duck) {
      this.$router.push(`/primordial-ducks?edit=${duck.id}`)
    },
    formatAvgMutations() {
      const avgMutations = this.duckStore.stats?.mutations?.avg_mutations
      if (avgMutations !== null && avgMutations !== undefined && !isNaN(avgMutations)) {
        return parseFloat(avgMutations).toFixed(1)
      }
      return '0.0'
    },


    editDuck(duckId) {
      this.$router.push(`/primordial-ducks?edit=${duckId}`)
    },
    startTour() {
      const steps = [
        {
          element: '#dashboard-stats',
          popover: {
            title: 'Estatísticas dos Patos',
            description: 'Aqui você vê um resumo de todos os patos catalogados, organizados por status de hibernação e número de mutações.'
          }
        },
        {
          element: '#dashboard-map',
          popover: {
            title: 'Mapa Interativo',
            description: 'Este mapa mostra a localização de todos os patos catalogados. Clique em um marcador para ver um popup com detalhes do pato e botão para editar.'
          }
        },
        {
          element: '#dashboard-chart',
          popover: {
            title: 'Gráfico de Distribuição',
            description: 'Visualize a distribuição dos patos por status de hibernação para entender melhor sua coleção.'
          }
        },
        {
          element: '#dashboard-table',
          popover: {
            title: 'Patos Recentes',
            description: 'Lista dos patos catalogados mais recentemente. Use os botões de ação para editar ou visualizar detalhes.'
          }
        }
      ]
      
      const driverObj = this.createDriver(steps, 'dashboard')
      driverObj.drive()
    }
  }
}
</script>

<style scoped lang="scss">
@import './Dashboard.scss';
</style>