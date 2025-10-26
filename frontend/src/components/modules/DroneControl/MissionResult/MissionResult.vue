<template>
  <BaseCard title="📋 Resultado da Missão">
    <div class="mission-result">
      <div class="result-header">
        <h3>{{ missionResult.strategy_used.name }}</h3>
        <div class="result-status" :class="{ success: missionResult.mission.success }">
          {{ missionResult.mission.success ? '✅ Sucesso' : '❌ Falha' }}
        </div>
      </div>
      
      <div class="result-details">
        <div class="flight-info">
          <h4>📍 Dados do Voo</h4>
          <ul>
            <li>Distância percorrida: {{ missionResult.flight.distance }}km</li>
            <li>Tempo de voo: {{ missionResult.flight.flight_time }} minutos</li>
            <li>Combustível consumido: {{ missionResult.flight.fuel_consumed }}%</li>
            <li>Bateria consumida: {{ missionResult.flight.battery_consumed }}%</li>
          </ul>
        </div>
        
        <div class="mission-info">
          <h4>⚔️ Dados da Missão</h4>
          <ul>
            <li>Energia utilizada: {{ missionResult.mission.energy_consumed }}%</li>
            <li>Danos recebidos: {{ missionResult.mission.damage_taken }}%</li>
          </ul>
        </div>
      </div>
      
      <div class="result-message">
        {{ missionResult.mission.result_message }}
      </div>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'

export default {
  name: 'MissionResult',
  components: {
    BaseCard
  },
  props: {
    missionResult: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import 'MissionResult.scss';
</style>