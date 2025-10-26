<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController)

export default {
  name: 'BarChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.createChart()
      }, 100)
    })
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  watch: {
    chartData: {
      handler() {
        if (this.chart) {
          this.chart.destroy()
          this.chart = null
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.createChart()
          }, 50)
        })
      },
      deep: true
    }
  },
  methods: {
    createChart() {
      if (!this.$refs.chartCanvas || !this.chartData) return
      
      // Garantir que não há gráfico anterior
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
      
      const canvas = this.$refs.chartCanvas
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return
      
      this.chart = new ChartJS(ctx, {
        type: 'bar',
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: '#e2e8f0',
                font: {
                  size: 12
                }
              },
              onClick: (e, legendItem, legend) => {
                const index = legendItem.datasetIndex
                const chart = legend.chart
                const meta = chart.getDatasetMeta(index)
                meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null
                chart.update()
              }
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#e2e8f0',
              bodyColor: '#e2e8f0',
              borderColor: '#00ff00',
              borderWidth: 1
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#e2e8f0'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#e2e8f0'
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 280px;
}
</style>