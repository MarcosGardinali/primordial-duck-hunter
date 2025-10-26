<template>
    <div class="brand-side">
        <div class="brand-content">
          <div class="logo">
            <img src="@/assets/images/cc-logo.png" alt="Duck Hunter Logo" class="logo-image" />
          </div>
          <h1 class="brand-title">Duck Hunter</h1>
          <p class="brand-subtitle">Caça Especializada</p>
          <p class="brand-description">Sistema avançado para caça e catalogação de Patos Primordiais</p>
          <div class="brand-features">
            <div class="feature">
              <span class="feature-icon"><img src="@/assets/icons/duck.svg" alt="Drone" style="width: 20px; height: 20px;"></span>
              <span>Catálogo de Patos</span>
            </div>
            <div class="feature">
              <span class="feature-icon"><img src="@/assets/icons/target.svg" alt="Drone" style="width: 20px; height: 20px;"></span>
              <span>Análise de Captura</span>
            </div>
            <div class="feature">
              <span class="feature-icon"><img src="@/assets/icons/drone.svg" alt="Drone" style="width: 20px; height: 20px;"></span>
              <span>Controle de Drones</span>
            </div>
          </div>
        </div>
        
        <div class="military-hud">
          <div class="hud-corner top-left"></div>
          <div class="hud-corner top-right"></div>
          <div class="hud-corner bottom-left"></div>
          <div class="hud-corner bottom-right"></div>
          
          <div class="scan-line"></div>
          
          <div class="status-indicators">
            <div class="status-item">
              <span class="status-dot active"></span>
              <span class="status-text">SISTEMA ONLINE</span>
            </div>
            <div class="status-item">
              <span class="status-dot active"></span>
              <span class="status-text">DRONES ATIVOS</span>
            </div>
            <div class="status-item">
              <span class="status-dot warning"></span>
              <span class="status-text">MISSÃO PENDENTE</span>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BrandSide',
};
</script>

<style scoped lang="scss">
@import 'BrandSide.scss';
</style>
