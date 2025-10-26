<template>
  <div class="superpowers">
    <div class="page-header" id="superpowers-header">
      <h1><img src="@/assets/icons/superpower.svg" alt="Superpower" style="width: 40px; height: 40px; vertical-align: middle; margin-right: 8px;"> Gerenciar Superpoderes</h1>
      <button @click="showCreateModal = true" class="btn btn-primary" id="superpowers-add-btn">
        + Adicionar Superpoder
      </button>
    </div>

    <!-- Filtros -->
    <Filters 
      v-model="filters" 
      :filters="filterConfig"
      @update:modelValue="applyFilters"
    />

    <BaseCard title="Superpoderes Cadastrados" id="superpowers-grid">
      <div class="superpowers-grid">
        <SuperpowerCard 
          v-for="power in paginatedSuperpowers" 
          :key="power.id" 
          :superpower="power"
          @edit="editSuperpower"
          @delete="deleteSuperpower"
        />
      </div>
      
      <Pagination 
        :current-page="currentPage"
        :total-items="totalItems"
        :page-size="10"
        @page-changed="onPageChange"
      />
    </BaseCard>

    <FormModal 
      :show="showCreateModal || showEditModal" 
      :title="(showEditModal ? 'Editar' : 'Adicionar') + ' Superpoder'"
      @close="closeModals"
    >
      <SuperpowerForm 
        :initial-data="editingSuperpower"
        :is-edit="showEditModal"
        @submit="submitForm"
        @cancel="closeModals"
      />
    </FormModal>

    <!-- Modal de Confirmação de Exclusão -->
    <DeleteModal
      :show="showDeleteModal"
      title="Excluir Superpoder"
      :message="`Tem certeza que deseja excluir o superpoder '${superpowerToDelete?.name}'?`"
      confirm-text="Excluir"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { useSuperpowerStore } from '@/stores'
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'
import FormModal from '@/components/shared/GenericModal/FormModal.vue'
import SuperpowerCard from '@/components/modules/Superpowers/SuperpowerCard.vue'
import SuperpowerForm from '@/components/modules/Superpowers/SuperpowerForm.vue'
import DeleteModal from '@/components/shared/GenericModal/DeleteModal.vue'
import Filters from '@/components/shared/Filters/Filters.vue'
import Pagination from '@/components/shared/Pagination/Pagination.vue'
import { useTour } from '@/composables/useTour'
import { useToast } from 'vue-toastification'

export default {
  name: 'Superpowers',
  components: {
    BaseCard,
    FormModal,
    SuperpowerCard,
    SuperpowerForm,
    DeleteModal,
    Filters,
    Pagination
  },
  data() {
    return {
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      editingSuperpower: null,
      superpowerToDelete: null,
      currentPage: 1,
      filters: {},
      debounceTimer: null,
      filterConfig: [
        {
          key: 'name',
          label: 'Nome',
          type: 'text',
          placeholder: 'Ex: Tempestade Elétrica'
        },
        {
          key: 'classification',
          label: 'Classificação',
          type: 'select',
          options: [
            { value: 'ofensivo', label: 'Ofensivo' },
            { value: 'defensivo', label: 'Defensivo' },
            { value: 'suporte', label: 'Suporte' },
            { value: 'especial', label: 'Especial' }
          ]
        }
      ],
      superpowerStore: useSuperpowerStore(),
      toast: useToast(),
      ...useTour()
    }
  },
  computed: {
    paginatedSuperpowers() {
      return this.superpowerStore.superpowers
    },
    totalItems() {
      return this.superpowerStore.pagination?.total || 0
    }
  },
  beforeUnmount() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
  },
  async mounted() {
    await this.loadSuperpowers()
    
    this.$nextTick(() => {
      if (this.shouldShowTour('superpowers')) {
        this.startTour()
      }
    })
  },
  methods: {
    editSuperpower(power) {
      this.editingSuperpower = power
      this.showEditModal = true
    },
    deleteSuperpower(power) {
      this.superpowerToDelete = power
      this.showDeleteModal = true
    },
    async confirmDelete() {
      try {
        await this.superpowerStore.deleteSuperpower(this.superpowerToDelete.id)
        this.toast.success('Superpoder excluído com sucesso!')
        this.cancelDelete()
      } catch (error) {
        const errorMessage = this.superpowerStore.error || 'Erro ao excluir superpoder'
        this.toast.error(errorMessage)
      }
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.superpowerToDelete = null
    },
    async submitForm(formData) {
      try {
        if (this.showEditModal) {
          await this.superpowerStore.updateSuperpower(this.editingSuperpower.id, formData)
          this.toast.success('Superpoder atualizado com sucesso!')
        } else {
          await this.superpowerStore.createSuperpower(formData)
          this.toast.success('Superpoder criado com sucesso!')
        }
        this.closeModals()
      } catch (error) {
        this.toast.error('Erro ao salvar superpoder')
      }
    },
    closeModals() {
      this.showCreateModal = false
      this.showEditModal = false
      this.editingSuperpower = null
    },
    startTour() {
      const steps = [
        {
          element: '#superpowers-header',
          popover: {
            title: 'Gerenciamento de Superpoderes',
            description: 'Aqui você gerencia todos os superpoderes que podem ser atribuídos aos Patos Primordiais despertos. Cada superpoder tem nome, descrição e classificação.'
          }
        },
        {
          element: '#superpowers-add-btn',
          popover: {
            title: 'Adicionar Novo Superpoder',
            description: 'Clique aqui para cadastrar um novo superpoder. Você precisará informar nome, descrição detalhada e classificação do poder.'
          }
        },
        {
          element: '#superpowers-grid',
          popover: {
            title: 'Grid de Superpoderes',
            description: 'Visualize todos os superpoderes cadastrados em cards. Cada card mostra nome, descrição e botões para editar ou excluir o superpoder.'
          }
        }
      ]
      
      const driverObj = this.createDriver(steps, 'superpowers')
      driverObj.drive()
    },
    async loadSuperpowers() {
      await this.superpowerStore.fetchSuperpowers(this.currentPage, this.filters)
    },
    async onPageChange(page) {
      this.currentPage = page
      await this.loadSuperpowers()
    },

    applyFilters() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      
      this.debounceTimer = setTimeout(async () => {
        this.currentPage = 1
        await this.loadSuperpowers()
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
@import './Superpowers.scss';
</style>