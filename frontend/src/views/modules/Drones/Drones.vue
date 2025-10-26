<template>
  <div class="drones">
    <div class="page-header" id="drones-header">
      <h1><img src="@/assets/icons/drone.svg" alt="Drone" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;"> Gerenciar Drones</h1>
      <button @click="showCreateModal = true" class="btn btn-primary" id="drones-add-btn">
        + Adicionar Drone
      </button>
    </div>

    <!-- Filtros -->
    <Filters 
      v-model="filters" 
      :filters="filterConfig"
      @update:modelValue="applyFilters"
    />

    <BaseCard title="Drones Cadastrados" id="drones-list">
      <DataTable 
        :data="paginatedDrones" 
        :columns="tableColumns" 
        :actions="true"
      >
        <template #actions="{ item }">
          <button @click="editDrone(item)" class="btn btn-sm btn-secondary">Editar</button>
          <button @click="deleteDrone(item)" class="btn btn-sm btn-danger">Excluir</button>
        </template>
      </DataTable>
      
      <Pagination 
        :current-page="currentPage"
        :total-items="totalItems"
        :page-size="10"
        @page-changed="onPageChange"
      />
    </BaseCard>

    <FormModal 
      :show="showCreateModal || showEditModal" 
      :title="(showEditModal ? 'Editar' : 'Adicionar') + ' Drone'"
      @close="closeModals"
    >
      <DroneForm 
        :initial-data="editingDrone"
        :is-edit="showEditModal"
        @submit="submitForm"
        @cancel="closeModals"
      />
    </FormModal>

    <DeleteModal
      :show="showDeleteModal"
      title="Excluir Drone"
      :message="`Tem certeza que deseja excluir o drone '${droneToDelete?.serial_number}'?`"
      confirm-text="Excluir"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { useDroneStore } from '@/stores'
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'
import DataTable from '@/components/shared/GenericTable/DataTable.vue'
import FormModal from '@/components/shared/GenericModal/FormModal.vue'
import DroneForm from '@/components/modules/Drones/DroneForm.vue'
import DeleteModal from '@/components/shared/GenericModal/DeleteModal.vue'
import Filters from '@/components/shared/Filters/Filters.vue'
import Pagination from '@/components/shared/Pagination/Pagination.vue'
import { useTour } from '@/composables/useTour'
import { useToast } from 'vue-toastification'

export default {
  name: 'Drones',
  components: {
    BaseCard,
    DataTable,
    FormModal,
    DroneForm,
    DeleteModal,
    Filters,
    Pagination
  },
  data() {
    return {
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      editingDrone: null,
      droneToDelete: null,
      currentPage: 1,
      filters: {},
      debounceTimer: null,
      tableColumns: [
        { key: 'serial_number', label: 'Número de Série' },
        { key: 'brand', label: 'Marca' },
        { key: 'manufacturer', label: 'Fabricante' },
        { key: 'country_origin', label: 'País de Origem' },
        { key: 'created_at', label: 'Data de Cadastro', type: 'date' }
      ],
      filterConfig: [
        {
          key: 'serial_number',
          label: 'Número de Série',
          type: 'text',
          placeholder: 'Ex: DRN-001'
        },
        {
          key: 'brand',
          label: 'Marca',
          type: 'text',
          placeholder: 'Ex: SkyHawk'
        },
        {
          key: 'manufacturer',
          label: 'Fabricante',
          type: 'text',
          placeholder: 'Ex: AeroTech'
        },
        {
          key: 'country_origin',
          label: 'País',
          type: 'text',
          placeholder: 'Ex: USA'
        }
      ],
      droneStore: useDroneStore(),
      toast: useToast(),
      ...useTour()
    }
  },
  computed: {
    paginatedDrones() {
      return this.droneStore.drones
    },
    totalItems() {
      return this.droneStore.pagination?.total || 0
    }
  },
  async mounted() {
    await this.loadDrones()
    
    this.$nextTick(() => {
      if (this.shouldShowTour('drones')) {
        this.startTour()
      }
    })
  },
  beforeUnmount() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
  },
  methods: {
    editDrone(drone) {
      this.editingDrone = drone
      this.showEditModal = true
    },
    deleteDrone(drone) {
      this.droneToDelete = drone
      this.showDeleteModal = true
    },
    async confirmDelete() {
      try {
        await this.droneStore.deleteDrone(this.droneToDelete.id)
        this.toast.success('Drone excluído com sucesso!')
        this.cancelDelete()
      } catch (error) {
        const errorMessage = this.droneStore.error || 'Erro ao excluir drone'
        this.toast.error(errorMessage)
      }
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.droneToDelete = null
    },
    async submitForm(formData) {
      try {
        if (this.showEditModal) {
          await this.droneStore.updateDrone(this.editingDrone.id, formData)
          this.toast.success('Drone atualizado com sucesso!')
        } else {
          await this.droneStore.createDrone(formData)
          this.toast.success('Drone criado com sucesso!')
        }
        this.closeModals()
      } catch (error) {
        const errorMessage = this.droneStore.error || error.message || 'Erro ao salvar drone'
        this.toast.error(errorMessage)
      }
    },
    closeModals() {
      this.showCreateModal = false
      this.showEditModal = false
      this.editingDrone = null
    },
    startTour() {
      const steps = [
        {
          element: '#drones-header',
          popover: {
            title: 'Gerenciamento de Drones',
            description: 'Aqui você gerencia todos os drones disponíveis para catalogar Patos Primordiais. Cada drone tem características únicas que definem as unidades de medida utilizadas.'
          }
        },
        {
          element: '#drones-add-btn',
          popover: {
            title: 'Adicionar Novo Drone',
            description: 'Clique aqui para cadastrar um novo drone. Você precisará informar número de série, marca, fabricante e país de origem.'
          }
        },
        {
          element: '#drones-list',
          popover: {
            title: 'Lista de Drones',
            description: 'Visualize todos os drones cadastrados com suas informações. Use os botões de ação para editar ou excluir drones existentes.'
          }
        }
      ]
      
      const driverObj = this.createDriver(steps, 'drones')
      driverObj.drive()
    },
    async loadDrones() {
      await this.droneStore.fetchDrones(this.currentPage, this.filters)
    },
    async onPageChange(page) {
      this.currentPage = page
      await this.loadDrones()
    },

    applyFilters() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      
      this.debounceTimer = setTimeout(async () => {
        this.currentPage = 1
        await this.loadDrones()
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
@import './Drones.scss';
</style>