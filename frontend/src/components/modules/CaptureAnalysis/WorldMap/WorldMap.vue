<template>
  <div class="world-map-container">
    <div class="map-header">
      <h3>🌍 DISTRIBUIÇÃO GLOBAL DE PATOS PRIMORDIAIS</h3>
    </div>

    <div ref="mapContainer" class="map-container"></div>

    <div class="legend">
        <div class="legend-item" v-for="(item, index) in legend" :key="index">
          <div class="color-box" :style="{ background: item.color }"></div>
          <span>{{ item.label }}</span>
        </div>
    </div>

    <div class="global-stats">
      <div class="stat-item" v-for="(stat, index) in stats" :key="index">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import 'highcharts/modules/map' // ✅ não precisa mais chamar a função
import worldMapData from '@highcharts/map-collection/custom/world.geo.json'

export default {
  name: 'WorldMap',

  props: {
    ducksByCountry: {
      type: Object,
      default: () => ({})
    },
    totalDucks: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      chart: null,
      legend: [
        { color: '#ff0000', label: '10+ Patos' },
        { color: '#ff6600', label: '5-9 Patos' },
        { color: '#ffaa00', label: '3-4 Patos' },
        { color: '#ffdd00', label: '1-2 Patos' },
        { color: '#333333', label: 'Sem Patos' },
      ]
    }
  },

  computed: {
    stats() {
      return [
        { value: this.totalDucks, label: 'Total de Patos' },
        { value: Object.keys(this.ducksByCountry).length, label: 'Países Ativos' },
        { value: `${this.successRate}%`, label: 'Taxa de Sucesso' },
      ]
    }
  },

  mounted() {
    this.createMap()
  },

  watch: {
    ducksByCountry: {
      handler() {
        this.updateMap()
      },
      deep: true
    }
  },

  methods: {
    createMap() {
      const data = Object.entries(this.ducksByCountry).map(([code, count]) => [code, count])

      const chartOptions = {
        chart: {
          map: worldMapData,
          backgroundColor: 'transparent',
        },
        title: { text: null },
        mapNavigation: {
          enabled: true,
          enableDoubleClickZoomTo: true,
          buttonOptions: { verticalAlign: 'bottom' }
        },
        colorAxis: {
          min: 0,
          max: Math.max(...data.map(([, count]) => count), 10),
          stops: [
            [0, '#333333'],
            [0.1, '#ffdd00'],
            [0.25, '#ffaa00'],
            [0.5, '#ff6600'],
            [1, '#ff0000']
          ],
        },
        tooltip: {
          backgroundColor: '#0f172a',
          borderColor: '#00ff00',
          borderWidth: 2,
          style: { color: '#e2e8f0', fontFamily: 'Orbitron, monospace' },
          pointFormat: '<b>{point.name}</b><br/>Patos: {point.value}'
        },
        series: [
          {
            data,
            mapData: worldMapData,
            joinBy: 'hc-key',
            name: 'Quantidade de Patos',
            states: { hover: { color: '#00ff00' } },
            borderColor: '#0f3460',
            nullColor: '#222',
            dataLabels: { enabled: false }
          }
        ]
      }

      this.chart = Highcharts.mapChart(this.$refs.mapContainer, chartOptions)
    },

    updateMap() {
      if (this.chart) {
        const data = Object.entries(this.ducksByCountry)
        this.chart.series[0].setData(data, true)
      } else {
        this.createMap()
      }
    }
  },

  beforeUnmount() {
    if (this.chart) this.chart.destroy()
  }
}
</script>

<style scoped lang="scss">
@import 'WorldMap.scss';
</style>
