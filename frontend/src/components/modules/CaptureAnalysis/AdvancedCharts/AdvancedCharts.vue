<template>
  <div class="advanced-charts">
    <!-- Gráfico de Barras -->
    <div class="chart-container">
      <h4>🏆 TOP PAÍSES COM MAIS PATOS</h4>
      <canvas ref="barChart" width="400" height="200"></canvas>
    </div>
    
    <!-- Gráfico de Pizza -->
    <div class="chart-container">
      <h4>🥧 DISTRIBUIÇÃO POR STATUS</h4>
      <canvas ref="doughnutChart" width="300" height="300"></canvas>
    </div>
    
    <!-- Gráfico de Linha -->
    <div class="chart-container">
      <h4>📈 TENDÊNCIA DE CATALOGAÇÃO</h4>
      <canvas ref="lineChart" width="400" height="200"></canvas>
    </div>

    <!-- Métricas Operacionais -->
    <div class="chart-container">
      <h4>📊 MÉTRICAS OPERACIONAIS</h4>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-title">CUSTO OPERACIONAL</div>
          <div class="chart-wrapper">
            <canvas ref="costChart" width="80" height="80"></canvas>
            <div class="metric-value">{{ operationalCost.toFixed(0) }}%</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-title">NÍVEL DE RISCO</div>
          <div class="chart-wrapper">
            <canvas ref="riskChart" width="80" height="80"></canvas>
            <div class="metric-value">{{ riskLevel.toFixed(0) }}%</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-title">GANHO CIENTÍFICO</div>
          <div class="chart-wrapper">
            <canvas ref="knowledgeChart" width="80" height="80"></canvas>
            <div class="metric-value">{{ knowledgeGain.toFixed(0) }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'AdvancedCharts',
  props: {
    analysisData: {
      type: Object,
      default: () => ({})
    },
    ducksByCountry: {
      type: Object,
      default: () => ({})
    },
    statusDistribution: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    barData() {
      return Object.entries(this.ducksByCountry)
        .map(([code, count]) => ({ name: this.getCountryName(code), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
    },
    pieData() {
      const total = Object.values(this.statusDistribution).reduce((sum, val) => sum + val, 0) || 1
      return {
        desperto: this.statusDistribution.desperto || 0,
        em_transe: this.statusDistribution.em_transe || 0,
        hibernacao_profunda: this.statusDistribution.hibernacao_profunda || 0,
        total
      }
    },
    operationalCost() {
      return this.analysisData?.avg_operational_cost || 0
    },
    riskLevel() {
      return this.analysisData?.avg_risk_level || 0
    },
    knowledgeGain() {
      return this.analysisData?.avg_knowledge_gain || 0
    }
  },
  data() {
    return {
      charts: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.createCharts()
      }, 100)
    })
  },
  beforeUnmount() {
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key]) {
        this.charts[key].destroy()
        this.charts[key] = null
      }
    })
  },
  watch: {
    operationalCost() {
      this.updateCharts()
    },
    riskLevel() {
      this.updateCharts()
    },
    knowledgeGain() {
      this.updateCharts()
    }
  },

  methods: {
    createCharts() {
      this.createBarChart()
      this.createDoughnutChart()
      this.createLineChart()
      this.createMetricCharts()
    },
    createBarChart() {
      if (!this.$refs.barChart || !this.$refs.barChart.getContext) return
      if (this.charts.barChart) {
        this.charts.barChart.destroy()
        this.charts.barChart = null
      }
      
      this.charts.barChart = new Chart(this.$refs.barChart, {
        type: 'bar',
        data: {
          labels: this.barData.map(item => item.name),
          datasets: [{
            data: this.barData.map(item => item.count),
            backgroundColor: ['#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00', '#ffff00'],
            borderColor: '#00ff99',
            borderWidth: 1,
            maxBarThickness: 60
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#e2e8f0' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: {
              ticks: { color: '#e2e8f0' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            }
          }
        }
      })
    },
    createDoughnutChart() {
      if (!this.$refs.doughnutChart || !this.$refs.doughnutChart.getContext) return
      if (this.charts.doughnutChart) {
        this.charts.doughnutChart.destroy()
        this.charts.doughnutChart = null
      }
      
      this.charts.doughnutChart = new Chart(this.$refs.doughnutChart, {
        type: 'doughnut',
        data: {
          labels: ['Desperto', 'Em Transe', 'Hibernação'],
          datasets: [{
            data: [this.pieData.desperto, this.pieData.em_transe, this.pieData.hibernacao_profunda],
            backgroundColor: ['#ff0000', '#0066ff', '#00ff00'],
            borderColor: '#00ff99',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#e2e8f0' }
            }
          }
        }
      })
    },
    createLineChart() {
      if (!this.$refs.lineChart || !this.$refs.lineChart.getContext) return
      if (this.charts.lineChart) {
        this.charts.lineChart.destroy()
        this.charts.lineChart = null
      }
      
      const totalDucks = this.ducksByCountry ? Object.values(this.ducksByCountry).reduce((sum, count) => sum + count, 0) : 0
      const capturedDucks = Math.floor(totalDucks * 0.3)
      
      this.charts.lineChart = new Chart(this.$refs.lineChart, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Catalogados',
            data: [0, Math.floor(totalDucks * 0.2), Math.floor(totalDucks * 0.4), Math.floor(totalDucks * 0.6), Math.floor(totalDucks * 0.8), totalDucks],
            borderColor: '#00ff00',
            backgroundColor: 'rgba(0,255,0,0.1)',
            tension: 0.4
          }, {
            label: 'Capturados',
            data: [0, Math.floor(capturedDucks * 0.1), Math.floor(capturedDucks * 0.3), Math.floor(capturedDucks * 0.5), Math.floor(capturedDucks * 0.8), capturedDucks],
            borderColor: '#ff0000',
            backgroundColor: 'rgba(255,0,0,0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              labels: { color: '#e2e8f0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#e2e8f0' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: {
              ticks: { color: '#e2e8f0' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            }
          }
        }
      })
    },
    createMetricCharts() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.createMetricChart('costChart', this.operationalCost, '#ffaa00')
        }, 50)
        setTimeout(() => {
          this.createMetricChart('riskChart', this.riskLevel, '#ff0000')
        }, 100)
        setTimeout(() => {
          this.createMetricChart('knowledgeChart', this.knowledgeGain, '#00ff00')
        }, 150)
      })
    },
    createMetricChart(ref, value, color) {
      if (!this.$refs[ref]) return
      if (!this.$refs[ref].getContext) return
      
      if (this.charts[ref]) {
        this.charts[ref].destroy()
        this.charts[ref] = null
      }
      
      this.$refs[ref].width = 80
      this.$refs[ref].height = 80
      
      this.charts[ref] = new Chart(this.$refs[ref], {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [Math.max(0, value), Math.max(0, 100 - value)],
            backgroundColor: [color, 'rgba(255,255,255,0.1)'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          animation: false,
          cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataIndex === 0 ? `${value.toFixed(0)}%` : ''
                }
              }
            }
          }
        }
      })
    },
    updateCharts() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.createCharts()
        }, 50)
      })
    },
    getCountryName(code) {
      const countryMap = {
        'br': 'Brasil',
        'us': 'EUA',
        'cn': 'China',
        'ru': 'Rússia',
        'ca': 'Canadá',
        'au': 'Austrália',
        'jp': 'Japão',
        'fr': 'França',
        'de': 'Alemanha',
        'gb': 'Reino Unido',
        'in': 'Índia',
        'mx': 'México',
        'ar': 'Argentina',
        'cl': 'Chile',
        'co': 'Colômbia'
      }
      return countryMap[code] || code?.toUpperCase() || 'Desconhecido'
    }
  }
}
</script>

<style scoped lang="scss">
@import 'AdvancedCharts.scss';
</style>