<template>
  <div class="map-selector">
    <div ref="mapContainer" class="map-container"></div>
    <div class="coordinates-display">
      <div class="info-row">
        <span>📍 Coordenadas: {{ Number(latitude).toFixed(6) }}, {{ Number(longitude).toFixed(6) }}</span>
      </div>
      <div v-if="locationInfo.city || locationInfo.country" class="info-row">
        <span>🏠 Local: {{ locationInfo.city }}{{ locationInfo.city && locationInfo.country ? ', ' : '' }}{{ locationInfo.country }}</span>
      </div>
      <div v-if="lastPrecision" class="info-row precision-info">
        <span>🎯 Precisão GPS: {{ lastPrecision.value }}{{ lastPrecision.unit }}</span>
      </div>
      <div v-if="referencePoint" class="info-row reference-info">
        <span>📍 Referência: {{ referencePoint }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para ícones do Leaflet no Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default {
  name: 'MapSelector',
  props: ['initialLat', 'initialLng'],
  data() {
    return {
      map: null,
      marker: null,
      latitude: -14.235,
      longitude: -51.9253,
      lastPrecision: null,
      locationInfo: {
        city: '',
        country: ''
      },
      referencePoint: ''
    }
  },
  mounted() {
    this.latitude = Number(this.initialLat) || -14.235
    this.longitude = Number(this.initialLng) || -51.9253
    setTimeout(() => {
      this.initMap()
      // Coletar informações automaticamente na posição inicial
      this.updatePosition(this.latitude, this.longitude)
    }, 500)
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    initMap() {
      if (!this.$refs.mapContainer || this.map) return
      
      this.map = L.map(this.$refs.mapContainer).setView([this.latitude, this.longitude], 6)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)

      this.marker = L.marker([this.latitude, this.longitude], {
        draggable: true
      }).addTo(this.map)

      this.map.on('click', (e) => {
        this.updatePosition(e.latlng.lat, e.latlng.lng)
      })
      
      this.marker.on('dragend', (e) => {
        const position = e.target.getLatLng()
        this.updatePosition(position.lat, position.lng)
      })
    },
    async updatePosition(lat, lng) {
      this.latitude = lat
      this.longitude = lng
      if (this.marker) {
        this.marker.setLatLng([lat, lng])
      }
      
      // Geocoding reverso para obter cidade e país
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR`)
        const data = await response.json()
        
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || ''
        const country = data.address?.country || ''
        const countryCode = data.address?.country_code?.toLowerCase()
        
        // Atualizar informações de localização
        this.locationInfo = { city, country }
        
        // Buscar ponto de referência
        const referencePoint = this.extractReferencePoint(data)
        this.referencePoint = referencePoint
        
        // Gerar precisão randomizada
        const precision = this.generateRandomPrecision(countryCode)
        this.lastPrecision = precision
        
        this.$emit('coordinates-changed', { 
          latitude: lat, 
          longitude: lng,
          city: city,
          country: country,
          country_code: countryCode,
          precision: precision.value,
          precisionUnit: precision.unit,
          referencePoint: referencePoint
        })
      } catch (error) {
        const precision = this.generateRandomPrecision()
        this.lastPrecision = precision
        this.referencePoint = 'Nenhum'
        this.$emit('coordinates-changed', { 
          latitude: lat, 
          longitude: lng,
          country_code: null,
          precision: precision.value,
          precisionUnit: precision.unit,
          referencePoint: 'Nenhum'
        })
      }
    },
    generateRandomPrecision(countryCode) {
      // Gerar entre 4cm e 30m (3000cm) sempre em centímetros
      const precisionCm = Math.floor(Math.random() * (3000 - 4 + 1)) + 4
      
      if (countryCode === 'us') {
        const precisionYards = (precisionCm / 91.44).toFixed(2)
        return {
          value: parseFloat(precisionYards),
          unit: 'yd'
        }
      }
      
      return {
        value: precisionCm,
        unit: 'cm'
      }
    },
    extractReferencePoint(data) {
      const references = [
        data.address?.tourism,
        data.address?.amenity,
        data.address?.leisure,
        data.address?.natural,
        data.address?.historic,
        data.address?.landuse,
        data.address?.place,
        data.display_name?.split(',')[0] // Primeiro elemento do nome completo
      ]
      
      // Retornar o primeiro ponto de referência encontrado
      for (const ref of references) {
        if (ref && ref.trim() && ref !== data.address?.city && ref !== data.address?.country) {
          return ref.trim()
        }
      }
      
      return 'Nenhum'
    }
  }
}
</script>

<style scoped lang="scss">
@import 'MapSelector.scss';
</style>