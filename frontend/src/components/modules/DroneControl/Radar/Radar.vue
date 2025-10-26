<template>
    <BaseCard title="Sistema de Radar - Selecione o Alvo">
      <template #title>
        <img src="@/assets/icons/target.svg" alt="Target" style="width: 32px; height: 32px; vertical-align: middle; margin-right: 8px;"> Sistema de Radar - Selecione o Alvo
      </template>
      <div class="radar-container">
        <div class="radar-screen">
          <div class="radar-sweep"></div>
          <div class="radar-grid">
            <div class="radar-circle" v-for="n in 4" :key="n"></div>
            <div class="radar-line horizontal"></div>
            <div class="radar-line vertical"></div>
          </div>
          <div 
            v-for="duck in availableDucks" 
            :key="duck.id"
            class="radar-target"
            :class="getTargetClass(duck.hibernation_status)"
            :style="getTargetPosition(duck)"
            @click="$emit('selectTarget', duck)"
            :title="duck.nickname || 'Pato Primordial'"
          >
            <div class="target-pulse"></div>
          </div>
        </div>
        <div class="radar-info">
          <div class="radar-legend">
            <div class="legend-item">
              <div class="legend-dot awake"></div>
              <span>Desperto</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot trance"></div>
              <span>Em Transe</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot hibernation"></div>
              <span>Hibernação</span>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
</template>

<script>
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'

export default {
    name: 'Radar',
    components: {
        BaseCard,
    },
    emits: ['selectTarget'],
    props: {
        availableDucks: {
            type: Array,
            required: true,
        },
    },
    methods: {
        getTargetPosition(duck) {
            // Gera posição pseudo-aleatória baseada no ID do pato
            const seed = duck.id * 12345
            const angle = (seed % 360) * (Math.PI / 180)
            const distance = 30 + ((seed * 7) % 120) // Entre 30% e 150% do raio

            const x = 50 + Math.cos(angle) * (distance / 100) * 40
            const y = 50 + Math.sin(angle) * (distance / 100) * 40

            return {
                left: `${Math.max(5, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(95, y))}%`
            }
        },
        getTargetClass(status) {
            const classMap = {
                'desperto': 'target-awake',
                'em_transe': 'target-trance',
                'hibernacao_profunda': 'target-hibernation'
            }
            return classMap[status] || 'target-awake'
        },
    },
};
</script>

<style scoped lang="scss">
@import 'Radar.scss';
</style>
