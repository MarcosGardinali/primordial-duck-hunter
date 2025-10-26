<template>
    <div class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <h3>🕊️ O Pato está livre...</h3>
            <div class="liberation-video">
                <video 
                    :src="freeVideo" 
                    autoplay 
                    loop 
                    class="free-video"
                >
                    Seu navegador não suporta vídeos.
                </video>
            </div>
            <div class="liberation-message">
                <p>{{ selectedDuck.nickname || 'O Pato Primordial' }} foi libertado com sucesso!</p>
                <p>Ele agora pode voar livre pelos céus...</p>
            </div>
            <div class="modal-actions">
                <button @click="$emit('close')" class="btn btn-primary">✨ Fechar</button>
            </div>
        </div>
    </div>
</template>

<script>
import freeVideo from '@/assets/duck-capture-videos/free.mp4'

export default {
    name: 'LiberationModal',
    emits: ['close'],
    props: {
        selectedDuck: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            freeVideo
        }
    }
}
</script>

<style scoped lang="scss">
@import 'LiberationModal.scss';
</style>