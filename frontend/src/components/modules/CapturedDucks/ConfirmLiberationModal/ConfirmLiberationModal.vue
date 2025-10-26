<template>
    <div class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <h3>🕊️ Confirmar Libertação</h3>
            <div class="duck-info">
                <img :src="getDuckPhotoUrl(selectedDuck)" :alt="selectedDuck.nickname" class="duck-photo">
                <p>🌅 <strong>{{ selectedDuck.nickname || 'Este pato' }}</strong> está pronto para voar livre pelos céus infinitos...</p>
                <p class="liberation-text">🗂️ Ao libertá-lo, seus dados serão apagados dos nossos arquivos secretos e ele desaparecerá para sempre de nossas bases de dados.</p>
                <p class="freedom-text">🕊️ Ele retornará à natureza selvagem, onde nenhum drone poderá encontrá-lo novamente.</p>
                <p class="warning">⚠️ Esta decisão é irreversível - uma vez livre, sempre livre!</p>
            </div>
            <div class="modal-actions">
                <button @click="$emit('close')" class="btn btn-secondary">❌ Cancelar</button>
                <button @click="confirmLiberation" class="btn btn-danger">🕊️ Libertar</button>
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
    name: 'ConfirmLiberationModal',
    emits: ['close', 'confirm'],
    props: {
        selectedDuck: {
            type: Object,
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
        confirmLiberation() {
            this.$emit('confirm', this.selectedDuck)
        }
    }
}
</script>

<style scoped lang="scss">
@import 'ConfirmLiberationModal.scss';
</style>