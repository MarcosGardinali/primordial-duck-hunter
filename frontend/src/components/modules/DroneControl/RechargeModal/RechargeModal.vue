<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h3>⚡ Recarga de Energia Primordial</h3>
      <p>Ao confirmar você iniciará o processo de recarga do drone. Deseja recarregar?</p>
      <div class="modal-actions">
        <button @click="$emit('close')" class="btn btn-secondary">❌ Cancelar</button>
        <button @click="$emit('recharge')" class="btn btn-primary">⚡ Recarregar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RechargeModal',
  emits: ['close', 'recharge']
}
</script>

<style scoped lang="scss">
@import 'RechargeModal.scss';
</style>