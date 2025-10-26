<template>
     <div class="control-panel">
      <BaseCard class="status-card">
        <template #title>
          <img src="@/assets/icons/chart.svg" alt="Status" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Status do Drone
        </template>
        <div class="drone-status">
          <div class="status-grid">
            <div class="status-item">
              <div class="status-label">Combustível</div>
              <div class="status-bar">
                <div class="status-fill fuel" :style="{ width: (droneStore.droneStatus?.fuel || 100) + '%' }"></div>
              </div>
              <div class="status-value">{{ droneStore.droneStatus?.fuel || 100 }}%</div>
            </div>
            <div class="status-item">
              <div class="status-label">Integridade</div>
              <div class="status-bar">
                <div class="status-fill integrity" :style="{ width: (droneStore.droneStatus?.integrity || 100) + '%' }"></div>
              </div>
              <div class="status-value">{{ droneStore.droneStatus?.integrity || 100 }}%</div>
            </div>
          </div>
          <div class="operational-status" :class="{ operational: droneStore.droneStatus?.operational !== false }">
            {{ droneStore.droneStatus?.operational !== false ? '✅ Operacional' : '❌ Fora de Operação' }}
          </div>
        </div>
      </BaseCard>

      <div class="battery-panel">
        <div class="battery-display">
          <div class="battery-container" :class="{ recharging: isRecharging }">
            <div class="battery-level" :style="{ height: displayBattery + '%' }" :class="{ 'recharge-animation': isRecharging }"></div>
            <div class="battery-percentage">{{ Math.round(displayBattery) }}%</div>
            <div v-if="isRecharging" class="recharge-effect"></div>
          </div>
          <div class="battery-label">ENERGIA PRIMORDIAL</div>
        </div>
        <button @click="$emit('openRechargeModal')" class="btn btn-primary recharge-btn" :disabled="isRecharging">
          {{ isRecharging ? '⚡ Recarregando...' : displayBattery == 100 ? '⚡ Drone Totalmente Carregado' : '⚡ Recarregar Drone com Energia Primordial' }}
        </button>
      </div>
    </div>
</template>

<script>
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'

export default {
    name: 'ControlPanel',
    components: {
        BaseCard,
    },
    emits: ['openRechargeModal'],
    props: {
        droneStore: {
            type: Object,
            required: true
        },
        isRecharging: {
            type: Boolean,
            default: false
        },
        displayBattery: {
            type: Number,
            default: 0
        }
    },
};
</script>

<style scoped lang="scss">
@import 'ControlPanel.scss';
</style>
