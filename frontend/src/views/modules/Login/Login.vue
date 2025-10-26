<template>
  <div class="login-container">
    <div class="content-wrapper">
      <BrandSide />
      <FormSide @openMilitaryModal="showMilitaryModal = true" />
    </div>
    
    <MilitaryRegistrationModal 
      :isVisible="showMilitaryModal" 
      @close="showMilitaryModal = false"
      @success="handleRegistrationSuccess"
    />
  </div>
</template>

<script>
import BrandSide from '@/components/modules/Login/BrandSide/BrandSide.vue';
import FormSide from '@/components/modules/Login/FormSide/FormSide.vue';
import MilitaryRegistrationModal from '@/components/modules/Login/MilitaryRegistrationModal/MilitaryRegistrationModal.vue';

export default {
  name: 'Login',
  components: {
    BrandSide,
    FormSide,
    MilitaryRegistrationModal
  },
  data() {
    return {
      showMilitaryModal: false
    }
  },
  methods: {
    handleRegistrationSuccess() {
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style scoped lang="scss">
@import './Login.scss';
@import '@/assets/theme/responsive-utils.scss';
</style>