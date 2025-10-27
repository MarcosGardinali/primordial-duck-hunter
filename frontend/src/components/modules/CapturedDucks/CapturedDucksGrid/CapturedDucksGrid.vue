<template>
    <div class="ducks-grid">
        <div 
            v-for="duck in capturedDucks" 
            :key="duck.id" 
            class="duck-card"
        >
            <div class="card-image">
                <img :src="getDuckPhotoUrl(duck)" :alt="duck.nickname" />
                <div class="capture-badge">CAPTURADO</div>
            </div>
            <div class="card-content">
                <h3>{{ duck.nickname || 'Pato Primordial' }}</h3>
                <div class="duck-info">
                    <div class="info-item">
                        <span class="label">Status:</span>
                        <span class="status-badge" :class="getStatusClass(duck.hibernation_status)">
                            {{ formatStatus(duck.hibernation_status) }}
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="label">Mutações:</span>
                        <span class="value">{{ duck.mutations_count }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Capturado via:</span>
                        <span class="strategy">{{ duck.capture_strategy }}</span>
                    </div>
                    <div v-if="duck.capture_defense" class="info-item">
                        <span class="label">Defesa Utilizada:</span>
                        <span class="strategy">{{ duck.capture_defense }}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button @click="$emit('watchCaptureVideo', duck)" class="watch-video-btn">
                        <img src="@/assets/icons/movie.svg" alt="Assistir Vídeo" /> Assistir Vídeo da Captura
                    </button>
                    <button @click="handleLiberateDuck(duck)" class="liberate-btn">
                        <img src="@/assets/icons/bird.svg" alt="Libertar Pato" /> Libertar Pato
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ppDesconhecido from '@/assets/images/pp-status/pp-desconhecido.png'
import ppDesperto from '@/assets/images/pp-status/pp-desperto.png'
import ppDespertoMutacoes from '@/assets/images/pp-status/pp-desperto-mutacoes.png'
import ppTranse from '@/assets/images/pp-status/pp-transe.png'
import ppHibernacao from '@/assets/images/pp-status/pp-hibernacao.png'

export default {
    name: 'CapturedDucksGrid',
	emits: ['watchCaptureVideo', 'liberateDuck'],
    props: {
        capturedDucks: {
              type: Array,
              required: true,
        },
    },
    methods: {
        getDuckPhotoUrl(duck) {
            const hibernationStatus = duck.hibernation_status
            const mutationsCount = duck.mutations_count
            
            if (!hibernationStatus) {
                return ppDesconhecido
            }
            
            switch (hibernationStatus) {
                case 'desperto':
                    return mutationsCount > 0 ? ppDespertoMutacoes : ppDesperto
                case 'em_transe':
                    return ppTranse
                case 'hibernacao_profunda':
                    return ppHibernacao
                default:
                    return ppDesconhecido
            }
        },
        handleLiberateDuck(duck) {
            this.$emit('liberateDuck', duck)
        },
        getStatusClass(status) {
            const classMap = {
                  'desperto': 'status-awake',
                  'em_transe': 'status-trance',
                  'hibernacao_profunda': 'status-hibernation'
            }
            return classMap[status] || ''
        },
        formatStatus(status) {
            const statusMap = {
                'desperto': 'Desperto',
                'em_transe': 'Em Transe',
                'hibernacao_profunda': 'Hibernação'
            }
            return statusMap[status] || status
        },
    },
};
</script>

<style scoped lang="scss">
@import 'CapturedDucksGrid.scss';
</style>