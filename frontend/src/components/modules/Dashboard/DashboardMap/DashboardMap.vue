<template>
  <div class="dashboard-map">
    <div ref="mapContainer" class="map-container">
      <div v-if="!mapReady" class="map-loading">
        <div class="loading-spinner"></div>
        <p>Carregando mapa...</p>
      </div>
    </div>
  </div>
</template>

<script>
let L = null
let leafletLoaded = false

async function loadLeaflet() {
  if (leafletLoaded) return L
  
  const [leafletModule] = await Promise.all([
    import('leaflet'),
    import('leaflet/dist/leaflet.css')
  ])
  
  L = leafletModule.default
  
  await Promise.all([
    import('leaflet.markercluster/dist/MarkerCluster.css'),
    import('leaflet.markercluster/dist/MarkerCluster.Default.css'),
    import('leaflet.markercluster')
  ])
  
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
  
  leafletLoaded = true
  return L
}

export default {
  name: 'DashboardMap',
  props: {
    ducks: {
      type: Array,
      default: () => []
    }
  },
  emits: ['duck-selected'],
  data() {
    return {
      map: null,
      markerClusterGroup: null,
      mapReady: false
    }
  },
  async mounted() {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.initMap()
        observer.disconnect()
      }
    }, { threshold: 0.1 })
    
    if (this.$refs.mapContainer) {
      observer.observe(this.$refs.mapContainer)
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  watch: {
    ducks: {
      handler() {
        this.updateMarkers()
      },
      deep: true
    }
  },
  methods: {
    async initMap() {
      if (!this.$refs.mapContainer) return
      
      try {
        await loadLeaflet()
        
        this.map = L.map(this.$refs.mapContainer, {
          zoomAnimation: false,
          fadeAnimation: false,
          markerZoomAnimation: false
        }).setView([-14.235, -51.9253], 4)
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map)

        this.markerClusterGroup = L.markerClusterGroup({
          chunkedLoading: true,
          maxClusterRadius: 50
        })
        
        this.map.addLayer(this.markerClusterGroup)
        this.mapReady = true
        this.updateMarkers()
      } catch (error) {
      }
    },
    updateMarkers() {
      if (!this.markerClusterGroup || !this.mapReady) return
      
      this.markerClusterGroup.clearLayers()
      
      // Adicionar marker da base DSIN
      this.addDSINBase()
      
      if (!Array.isArray(this.ducks)) return
      
      this.ducks.forEach(duck => {
        if (duck.latitude && duck.longitude) {
          const icon = this.getStatusIcon(duck.hibernation_status)
          const marker = L.marker([duck.latitude, duck.longitude], { icon })
          
          const popupContent = this.createPopupContent(duck)
          marker.bindPopup(popupContent)
          
          this.markerClusterGroup.addLayer(marker)
        }
      })
    },
    getStatusIcon(status) {
      const colors = {
        'desperto': '#ef4444',
        'em_transe': '#3b82f6', 
        'hibernacao_profunda': '#10b981'
      }
      
      const color = colors[status] || '#6b7280'
      
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    },
    createPopupContent(duck) {
      const statusMap = {
        'desperto': 'Desperto',
        'em_transe': 'Em Transe',
        'hibernacao_profunda': 'Hibernação Profunda'
      }
      const photoUrl = this.getDuckPhotoUrl(duck.hibernation_status, duck.mutations_count || 0)
      const photoHtml = `<img src="${photoUrl}" alt="${duck.nickname || 'Pato'}" class="popup-duck-photo" />`
      
      const capturedBadge = duck.captured 
        ? `<div class="popup-captured-badge">🎯 CAPTURADO</div>`
        : ''
      
      const actionButton = duck.captured 
        ? `<div class="popup-captured-info">Este pato já foi capturado e não pode ser editado</div>`
        : `<button onclick="window.editDuck(${duck.id})" class="popup-edit-btn">✏️ Editar</button>`
      
      return `
        <div class="duck-popup-military">
          <div class="popup-header">
            ${photoHtml}
            <h4>${duck.nickname || 'Sem apelido'}</h4>
            ${capturedBadge}
          </div>
          <div class="popup-info">
            <p><strong>Drone:</strong> ${duck.serial_number}</p>
            <p><strong>Local:</strong> ${duck.city}, ${duck.country}</p>
            <p><strong>Status:</strong> ${statusMap[duck.hibernation_status]}</p>
            <p><strong>Mutações:</strong> ${duck.mutations_count}</p>
            ${duck.superpower_name ? `<p><strong>Superpoder:</strong> ${duck.superpower_name}</p>` : ''}
          </div>
          ${actionButton}
        </div>
      `
    },
    addDSINBase() {
      const baseIcon = L.divIcon({
        className: 'dsin-base-marker',
        html: `<img src="/src/assets/icons/headquarter.svg" style="width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));" />`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
      
      const baseMarker = L.marker([-22.233613471585674, -49.93410614450074], { icon: baseIcon })
      const basePopup = this.createDSINPopup()
      baseMarker.bindPopup(basePopup)
      
      this.map.addLayer(baseMarker)
    },

    createDSINPopup() {
      return `
        <div class="dsin-popup-military">
          <div class="popup-header">
            <div class="base-icon"><img src="/src/assets/icons/headquarter.svg" style="width: 32px; height: 32px;" /></div>
            <h4>DSIN</h4>
            <div class="popup-base-badge">🎯 BASE DE OPERAÇÕES</div>
          </div>
          <div class="popup-info">
            <p><strong>Nome:</strong> DSIN</p>
            <p><strong>Coordenadas:</strong> -22.2336, -49.9341</p>
            <p><strong>Status:</strong> Operacional 24/7</p>
            <p><strong>Função:</strong> Centro de comando para operações de captura</p>
            <p><strong>Recursos:</strong> Drones, laboratórios, centro de análise</p>
          </div>
          <div class="popup-base-info">
            <strong>🎯 Missão:</strong> Catalogar e capturar Patos Primordiais para estudo científico e proteção da humanidade.
          </div>
        </div>
      `
    },

    getDuckPhotoUrl(status, mutations) {
      const baseUrl = '/src/assets/images/pp-status/'
      
      if (!status) {
        return baseUrl + 'pp-desconhecido.png'
      }
      
      switch (status) {
        case 'desperto':
          return baseUrl + (mutations > 0 ? 'pp-desperto-mutacoes.png' : 'pp-desperto.png')
        case 'em_transe':
          return baseUrl + 'pp-transe.png'
        case 'hibernacao_profunda':
          return baseUrl + 'pp-hibernacao.png'
        default:
          return baseUrl + 'pp-desconhecido.png'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'DashboardMap.scss';

.map-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #6b7280;
  
  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 12px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>