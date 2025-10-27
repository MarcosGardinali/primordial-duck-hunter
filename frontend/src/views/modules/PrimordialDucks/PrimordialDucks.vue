<template>
  <div class="primordial-ducks">
    <div class="page-header" id="catalog-header">
      <h1><img src="@/assets/icons/duck.svg" alt="Duck" style="width: 40px; height: 40px; vertical-align: middle; margin-right: 8px;"> Catálogo de Patos Primordiais</h1>
      <button @click="showCreateModal = true" class="btn btn-primary" id="catalog-new-btn">
        + Catalogar Novo Pato
      </button>
    </div>

    <!-- Estatísticas -->
    <div id="catalog-stats">
      <StatsGrid v-if="duckStore.stats" :stats="statsData">
        <template #status="{ stat }">
          <div class="status-list">
            <div v-for="status in duckStore.stats.by_status" :key="status.hibernation_status" class="status-item">
              <span class="status-badge" :class="getStatusClass(status.hibernation_status)">
                {{ formatStatus(status.hibernation_status) }}
              </span>
              <span>{{ status.count }}</span>
            </div>
          </div>
        </template>
        <template #mutations="{ stat }">
          <div class="mutation-stats">
            <div>Média: {{ formatAvgMutations() }}</div>
            <div>Máximo: {{ duckStore.stats.mutations?.max_mutations || 0 }}</div>
          </div>
        </template>
      </StatsGrid>
    </div>

    <!-- Filtros -->
    <Filters 
      v-model="filters" 
      :filters="filterConfig"
      @update:modelValue="applyFilters"
    />

    <!-- Lista de Patos -->
    <BaseCard title="Patos Catalogados" id="catalog-grid">
      <div class="ducks-grid">
        <DuckCard
          v-for="duck in paginatedDucks"
          :key="duck.id"
          :duck="duck"
          @edit="editDuck"
          @delete="deleteDuck"
        />
      </div>
      
      <Pagination 
        :current-page="currentPage"
        :total-items="totalItems"
        :page-size="10"
        @page-changed="onPageChange"
      />
    </BaseCard>

    <!-- Modal de Criação/Edição -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? 'Editar' : 'Catalogar' }} Pato Primordial</h3>
          <button @click="closeModals" class="close-btn"><i class="pi pi-times"></i></button>
        </div>
        <div class="modal-body">
          <!-- Card com foto do pato -->
          <div class="duck-photo-card">
            <div class="photo-container">
              <img :src="getCurrentPhotoUrlForDisplay()" :alt="getPhotoAlt()" class="duck-photo" />
            </div>
            <div class="photo-info">
              <h4>{{ getPhotoTitle() }}</h4>
              <p>{{ getPhotoDescription() }}</p>
            </div>
          </div>
          
          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <BaseInput
                id="duck-nickname"
                v-model="form.nickname"
                label="Apelido:"
                type="text"
                placeholder="Ex: Pato Dourado"
                required
              />

              <BaseInput
                id="duck-drone"
                v-model="form.drone_id"
                label="Drone:"
                type="select"
                required
                @change="onDroneChange"
              >
                <option value="">Selecione um drone</option>
                <option 
                  v-for="drone in droneStore.allDrones" 
                  :key="drone.id" 
                  :value="drone.id"
                >
                  {{ drone.serial_number }} - {{ drone.brand }} ({{ drone.country_origin }})
                </option>
              </BaseInput>

              <div class="form-group">
                <label>Altura:</label>
                <div class="input-with-unit">
                  <BaseInput
                    id="duck-height"
                    v-model="form.height"
                    type="number"
                    :step="0.01"
                    required
                    placeholder="Ex: 5.9"
                  />
                  <BaseInput
                    id="duck-height-unit"
                    v-model="form.height_unit"
                    type="select"
                    :disabled="true"
                    class="unit-select"
                  >
                    <option value="cm">cm</option>
                    <option value="ft">pés</option>
                  </BaseInput>
                </div>
                <small v-if="form.height_unit" class="unit-info">
                  Unidade definida pelo país do drone: {{ getUnitLabel(form.height_unit, 'height') }}
                </small>
              </div>

              <div class="form-group">
                <label>Peso:</label>
                <div class="input-with-unit">
                  <BaseInput
                    id="duck-weight"
                    v-model="form.weight"
                    type="number"
                    :step="0.01"
                    required
                    placeholder="Ex: 458.96"
                  />
                  <BaseInput
                    id="duck-weight-unit"
                    v-model="form.weight_unit"
                    type="select"
                    :disabled="true"
                    class="unit-select"
                  >
                    <option value="g">gramas</option>
                    <option value="lb">libras</option>
                  </BaseInput>
                </div>
                <small v-if="form.weight_unit" class="unit-info">
                  Unidade definida pelo país do drone: {{ getUnitLabel(form.weight_unit, 'weight') }}
                </small>
              </div>

              <BaseInput
                id="duck-status"
                v-model="form.hibernation_status"
                label="Status de Hibernação:"
                type="select"
                required
                @change="onStatusChange"
              >
                <option value="">Selecione o status</option>
                <option value="desperto">Desperto</option>
                <option value="em_transe">Em Transe</option>
                <option value="hibernacao_profunda">Hibernação Profunda</option>
              </BaseInput>

              <BaseInput
                v-if="form.hibernation_status === 'em_transe' || form.hibernation_status === 'hibernacao_profunda'"
                id="duck-heart-rate"
                v-model="form.heart_rate_bpm"
                label="Batimentos Cardíacos (bpm):"
                type="number"
                :min="1"
                required
              />

              <BaseInput
                id="duck-mutations"
                v-model="form.mutations_count"
                label="Quantidade de Mutações:"
                type="number"
                :min="0"
                required
              />

              <BaseInput
                v-if="form.hibernation_status === 'desperto'"
                id="duck-superpower"
                v-model="form.superpower_id"
                label="Superpoder:"
                type="select"
                required
              >
                <option value="">Selecione um superpoder</option>
                <option 
                  v-for="power in superpowerStore.allSuperpowers" 
                  :key="power.id" 
                  :value="power.id"
                >
                  {{ power.name }}
                </option>
              </BaseInput>
            </div>

            <div class="map-section">
              <h4><i class="pi pi-map-marker"></i> Localização do Pato</h4>
              <p>Clique no mapa para marcar onde o pato foi encontrado. A cidade, país e precisão GPS serão preenchidos automaticamente:</p>
              <MapSelector 
                v-if="showCreateModal || showEditModal"
                :initial-lat="form.latitude || -14.235" 
                :initial-lng="form.longitude || -51.9253"
                @coordinates-changed="onCoordinatesChanged"
                @loading-changed="onMapLoadingChanged"
              />
            </div>

            <div class="modal-actions form-actions">
              <button type="button" @click="closeModals" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">
                {{ showEditModal ? 'Atualizar' : 'Catalogar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <DeleteModal
      :show="showDeleteModal"
      title="Excluir Pato Primordial"
      :message="`Tem certeza que deseja excluir o pato '${duckToDelete?.nickname || 'sem apelido'}'?`"
      confirm-text="Excluir"
      @confirm="confirmDeleteDuck"
      @cancel="cancelDeleteDuck"
    />
  </div>
</template>

<script>
import { usePrimordialDuckStore, useDroneStore, useSuperpowerStore } from '@/stores'
import BaseCard from '@/components/shared/BaseCard/BaseCard.vue'
import BaseInput from '@/components/shared/BaseInput/BaseInput.vue'
import StatsGrid from '@/components/shared/StatsGrid/StatsGrid.vue'
import MapSelector from '@/components/modules/PrimordialDucks/MapSelector/MapSelector.vue'
import DeleteModal from '@/components/shared/GenericModal/DeleteModal.vue'
import DuckCard from '@/components/modules/PrimordialDucks/DuckCard/DuckCard.vue'
import Filters from '@/components/shared/Filters/Filters.vue'
import Pagination from '@/components/shared/Pagination/Pagination.vue'
import { useTour } from '@/composables/useTour'
import { useToast } from 'vue-toastification'
import api from '@/api/axios'
import ppDesconhecido from '@/assets/images/pp-status/pp-desconhecido.png'
import ppDesperto from '@/assets/images/pp-status/pp-desperto.png'
import ppDespertoMutacoes from '@/assets/images/pp-status/pp-desperto-mutacoes.png'
import ppTranse from '@/assets/images/pp-status/pp-transe.png'
import ppHibernacao from '@/assets/images/pp-status/pp-hibernacao.png'

export default {
  name: 'PrimordialDucks',
  components: {
    BaseCard,
    BaseInput,
    StatsGrid,
    MapSelector,
    DeleteModal,
    DuckCard,
    Filters,
    Pagination
  },
  data() {
    return {
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      editingDuck: null,
      duckToDelete: null,
      currentPage: 1,
      filters: {},
      isMapLoading: false,
      debounceTimer: null,
      form: {
        nickname: '',
        photo_url: '',
        drone_id: '',
        height: '',
        height_unit: 'cm',
        weight: '',
        weight_unit: 'g',
        city: '',
        country: '',
        latitude: '',
        longitude: '',
        gps_precision: '',
        precision_unit: 'cm',
        reference_point: '',
        hibernation_status: '',
        heart_rate_bpm: '',
        mutations_count: 0,
        superpower_id: ''
      },
      filterConfig: [
        {
          key: 'nickname',
          label: 'Apelido',
          type: 'text',
          placeholder: 'Ex: Pato Dourado'
        },
        {
          key: 'hibernation_status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'desperto', label: 'Desperto' },
            { value: 'em_transe', label: 'Em Transe' },
            { value: 'hibernacao_profunda', label: 'Hibernação Profunda' }
          ]
        },
        {
          key: 'country',
          label: 'País',
          type: 'text',
          placeholder: 'Ex: Brasil'
        },
        {
          key: 'mutations_count',
          label: 'Mutações',
          type: 'range'
        }
      ],
      duckStore: usePrimordialDuckStore(),
      droneStore: useDroneStore(),
      superpowerStore: useSuperpowerStore(),
      toast: useToast(),
      ...useTour()
    }
  },

  computed: {
    statsData() {
      if (!this.duckStore.stats) return []
      return [
        {
          key: 'total',
          title: 'Total Catalogados',
          value: this.duckStore.stats.total
        },
        {
          key: 'status',
          title: 'Por Status',
          value: ''
        },
        {
          key: 'mutations',
          title: 'Mutações',
          value: ''
        }
      ]
    },
    paginatedDucks() {
      return this.duckStore.ducks
    },
    totalItems() {
      return this.duckStore.pagination?.total || 0
    }
  },
  beforeUnmount() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
  },
  async mounted() {
    await Promise.all([
      this.loadDucks(),
      this.duckStore.fetchStats(),
      this.droneStore.fetchAllDrones(),
      this.superpowerStore.fetchAllSuperpowers()
    ])
    
    // Verificar se deve abrir modal de edição via query param
    const editId = this.$route.query.edit
    if (editId) {
      const duck = this.duckStore.ducks.find(d => d.id == editId)
      if (duck) {
        this.editDuck(duck)
      }
    }

    // Iniciar tour se necessário
    this.$nextTick(() => {
      if (this.shouldShowTour('catalog')) {
        this.startTour()
      }
    })
  },
  methods: {
    formatStatus(status) {
      const statusMap = {
        'desperto': 'Desperto',
        'em_transe': 'Em Transe',
        'hibernacao_profunda': 'Hibernação Profunda'
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      const classMap = {
        'desperto': 'status-awake',
        'em_transe': 'status-trance',
        'hibernacao_profunda': 'status-hibernation'
      }
      return classMap[status] || ''
    },
    async onDroneChange() {
      if (this.form.drone_id) {
        try {
          const response = await api.get(`/drones/${this.form.drone_id}/units`)
          this.form.height_unit = response.data.height_unit
          this.form.weight_unit = response.data.weight_unit
          this.form.precision_unit = response.data.precision_unit
        } catch (error) {
          // Fallback para unidades padrão
          this.form.height_unit = 'cm'
          this.form.weight_unit = 'g'
          this.form.precision_unit = 'cm'
        }
      }
    },
    onStatusChange() {
      if (this.form.hibernation_status === 'desperto') {
        this.form.heart_rate_bpm = ''
      } else {
        this.form.superpower_id = ''
      }
    },
    getCurrentPhotoUrl() {
      const status = this.form.hibernation_status
      const mutations = this.form.mutations_count || 0
      
      if (!status) {
        return 'pp-desconhecido.png'
      }
      
      switch (status) {
        case 'desperto':
          return mutations > 0 ? 'pp-desperto-mutacoes.png' : 'pp-desperto.png'
        case 'em_transe':
          return 'pp-transe.png'
        case 'hibernacao_profunda':
          return 'pp-hibernacao.png'
        default:
          return 'pp-desconhecido.png'
      }
    },
    getCurrentPhotoUrlForDisplay() {
      const status = this.form.hibernation_status
      const mutations = this.form.mutations_count || 0
      
      if (!status) {
        return ppDesconhecido
      }
      
      switch (status) {
        case 'desperto':
          return mutations > 0 ? ppDespertoMutacoes : ppDesperto
        case 'em_transe':
          return ppTranse
        case 'hibernacao_profunda':
          return ppHibernacao
        default:
          return ppDesconhecido
      }
    },
    getPhotoAlt() {
      const status = this.form.hibernation_status
      if (!status) return 'Pato Primordial Desconhecido'
      
      const statusMap = {
        'desperto': this.form.mutations_count > 0 ? 'Pato Primordial Desperto com Mutações' : 'Pato Primordial Desperto',
        'em_transe': 'Pato Primordial em Transe',
        'hibernacao_profunda': 'Pato Primordial em Hibernação Profunda'
      }
      return statusMap[status] || 'Pato Primordial Desconhecido'
    },
    getPhotoTitle() {
      const status = this.form.hibernation_status
      if (!status) return 'Status Desconhecido'
      
      const statusMap = {
        'desperto': this.form.mutations_count > 0 ? 'Desperto com Mutações' : 'Desperto',
        'em_transe': 'Em Transe',
        'hibernacao_profunda': 'Hibernação Profunda'
      }
      return statusMap[status] || 'Status Desconhecido'
    },
    getPhotoDescription() {
      const status = this.form.hibernation_status
      const mutations = this.form.mutations_count || 0
      
      if (!status) {
        return 'Selecione o status de hibernação para ver a aparência do pato'
      }
      
      const descriptions = {
        'desperto': mutations > 0 
          ? `Pato ativo e alerta com ${mutations} mutação(s) visível(is)`
          : 'Pato ativo e alerta, sem mutações aparentes',
        'em_transe': `Pato em estado de transe (${this.form.heart_rate_bpm || '?'} bpm)`,
        'hibernacao_profunda': `Pato em hibernação profunda (${this.form.heart_rate_bpm || '?'} bpm)`
      }
      
      return descriptions[status] || 'Status não reconhecido'
    },

    getUnitLabel(unit, type) {
      const labels = {
        height: { cm: 'centímetros', ft: 'pés' },
        weight: { g: 'gramas', lb: 'libras' },
        precision: { cm: 'centímetros', yd: 'jardas' }
      }
      return labels[type][unit] || unit
    },

    onMapLoadingChanged(isLoading) {
      this.isMapLoading = isLoading
    },

    onCoordinatesChanged(coords) {
      this.form.latitude = coords.latitude
      this.form.longitude = coords.longitude
      this.form.city = coords.city || 'Não informado'
      this.form.country = coords.country || 'Não informado'
      this.form.country_code = coords.country_code || null
      this.form.gps_precision = coords.precision || 10
      
      // Definir unidade de distância baseada no país
      const country = (coords.country || '').toLowerCase()
      const isUSA = country.includes('estados unidos') || country.includes('usa') || country.includes('eua')
      this.form.precision_unit = isUSA ? 'yd' : 'cm'
      
      this.form.reference_point = coords.referencePoint || 'Nenhum'
    },
    async editDuck(duck) {
      // Verificar se o pato foi capturado
      if (duck.captured) {
        this.toast.warning('Este pato já foi capturado e não pode ser editado.')
        return
      }
      
      this.editingDuck = duck
      
      // Buscar dados completos do pato com unidades corretas
      try {
        const response = await api.get(`/primordial-ducks/${duck.id}`)
        const fullDuck = response.data
        
        this.form = {
          nickname: fullDuck.nickname || '',
          photo_url: fullDuck.photo_url || '',
          drone_id: fullDuck.drone_id,
          height: fullDuck.height,
          height_unit: fullDuck.height_unit || 'cm',
          weight: fullDuck.weight,
          weight_unit: fullDuck.weight_unit || 'g',
          city: fullDuck.city,
          country: fullDuck.country,
          country_code: fullDuck.country_code || null,
          latitude: fullDuck.latitude,
          longitude: fullDuck.longitude,
          gps_precision: fullDuck.gps_precision,
          precision_unit: fullDuck.precision_unit || 'cm',
          reference_point: fullDuck.reference_point || '',
          hibernation_status: fullDuck.hibernation_status,
          heart_rate_bpm: fullDuck.heart_rate_bpm || '',
          mutations_count: fullDuck.mutations_count,
          superpower_id: fullDuck.superpower_id || ''
        }
      } catch (error) {
        this.form = {
          nickname: duck.nickname || '',
          photo_url: duck.photo_url || '',
          drone_id: duck.drone_id,
          height: duck.height,
          height_unit: duck.height_unit || 'cm',
          weight: duck.weight,
          weight_unit: duck.weight_unit || 'g',
          city: duck.city,
          country: duck.country,
          country_code: duck.country_code || null,
          latitude: duck.latitude,
          longitude: duck.longitude,
          gps_precision: duck.gps_precision,
          precision_unit: duck.precision_unit || 'cm',
          reference_point: duck.reference_point || '',
          hibernation_status: duck.hibernation_status,
          heart_rate_bpm: duck.heart_rate_bpm || '',
          mutations_count: duck.mutations_count,
          superpower_id: duck.superpower_id || ''
        }
      }
      
      this.showEditModal = true
    },
    deleteDuck(duck) {
      this.duckToDelete = duck
      this.showDeleteModal = true
    },
    async confirmDeleteDuck() {
      try {
        await this.duckStore.deleteDuck(this.duckToDelete.id)
        await this.duckStore.fetchStats()
        this.toast.success('Pato Primordial excluído com sucesso!')
        this.cancelDeleteDuck()
      } catch (error) {
        this.toast.error('Erro ao excluir Pato Primordial')
      }
    },
    cancelDeleteDuck() {
      this.showDeleteModal = false
      this.duckToDelete = null
    },
    async submitForm() {
      if (this.isMapLoading) {
        this.toast.info('Aguarde enquanto as informações de localização são obtidas.')
        return
      }

      if (!this.validateForm()) {
        return
      }
      
      // Salvar URL da foto no banco
      const formData = { ...this.form }
      
      // Converter vírgula para ponto e garantir que é um número
      if (typeof formData.height === 'string') {
        formData.height = parseFloat(formData.height.replace(',', '.'))
      }
      if (typeof formData.weight === 'string') {
        formData.weight = parseFloat(formData.weight.replace(',', '.'))
      }

      formData.photo_url = this.getCurrentPhotoUrl()
      
      try {
        if (this.showEditModal) {
          await this.duckStore.updateDuck(this.editingDuck.id, formData)
          this.toast.success('Pato Primordial atualizado com sucesso!')
        } else {
          await this.duckStore.createDuck(formData)
          this.toast.success('Pato Primordial catalogado com sucesso!')
        }
        await this.duckStore.fetchStats()
        this.closeModals()
      } catch (error) {
        this.toast.error('Erro ao salvar Pato Primordial')
      }
    },
    validateForm() {
      const errors = []
      
      // Validar apelido
      if (!this.form.nickname?.trim()) {
        errors.push('Apelido é obrigatório')
      }
      
      // Validar drone
      if (!this.form.drone_id) {
        errors.push('Drone é obrigatório')
      }
      
      // Validar dimensões
      if (!this.form.height || this.form.height <= 0) {
        errors.push('Altura é obrigatória e deve ser maior que zero')
      }
      if (!this.form.weight || this.form.weight <= 0) {
        errors.push('Peso é obrigatório e deve ser maior que zero')
      }
      
      // Validar localização
      if (!this.form.city?.trim()) {
        errors.push('Cidade é obrigatória')
      }
      if (!this.form.country?.trim()) {
        errors.push('País é obrigatório')
      }
      if (!this.form.latitude) {
        errors.push('Latitude é obrigatória')
      }
      if (!this.form.longitude) {
        errors.push('Longitude é obrigatória')
      }
      if (!this.form.gps_precision || this.form.gps_precision <= 0) {
        errors.push('Precisão GPS é obrigatória e deve ser maior que zero')
      }
      if (!this.form.reference_point?.trim()) {
        errors.push('Ponto de referência é obrigatório')
      }
      
      // Validar status de hibernação
      if (!this.form.hibernation_status) {
        errors.push('Status de hibernação é obrigatório')
      }
      
      // Validar batimentos cardíacos para status em transe ou hibernação
      if ((this.form.hibernation_status === 'em_transe' || this.form.hibernation_status === 'hibernacao_profunda') && 
          (!this.form.heart_rate_bpm || this.form.heart_rate_bpm <= 0)) {
        errors.push('Batimentos cardíacos são obrigatórios para patos em transe ou hibernação')
      }
      
      // Validar superpoder para patos despertos
      if (this.form.hibernation_status === 'desperto' && !this.form.superpower_id) {
        errors.push('Superpoder é obrigatório para patos despertos')
      }
      
      // Validar quantidade de mutações
      if (this.form.mutations_count === '' || this.form.mutations_count < 0) {
        errors.push('Quantidade de mutações é obrigatória e deve ser maior ou igual a zero')
      }
      
      if (errors.length > 0) {
        this.toast.error('Por favor, corrija os seguintes erros:\n\n' + errors.join('\n'))
        return false
      }
      
      return true
    },
    closeModals() {
      this.showCreateModal = false
      this.showEditModal = false
      this.editingDuck = null
      this.resetForm()
      
      // Remover query param se existir
      if (this.$route.query.edit) {
        this.$router.replace({ query: {} })
      }
    },
    resetForm() {
      this.form = {
        nickname: '',
        photo_url: '',
        drone_id: '',
        height: '',
        height_unit: 'cm',
        weight: '',
        weight_unit: 'g',
        city: '',
        country: '',
        country_code: null,
        latitude: '',
        longitude: '',
        gps_precision: '',
        precision_unit: 'cm',
        reference_point: '',
        hibernation_status: '',
        heart_rate_bpm: '',
        mutations_count: 0,
        superpower_id: ''
      }
    },
    formatAvgMutations() {
      const stats = this.duckStore.stats
      if (!stats) return '0.0'
      
      // Tentar diferentes formatos de resposta do backend
      let avgMutations = stats.mutations?.avg_mutations || 
                        stats.avg_mutations || 
                        stats.mutations_avg ||
                        0
      
      // Se ainda for 0, calcular manualmente a partir dos patos
      if (avgMutations === 0 && this.duckStore.ducks.length > 0) {
        const totalMutations = this.duckStore.ducks.reduce((sum, duck) => sum + (duck.mutations_count || 0), 0)
        avgMutations = totalMutations / this.duckStore.ducks.length
      }
      
      return Number(avgMutations).toFixed(1)
    },
    startTour() {
      const steps = [
        {
          element: '#catalog-header',
          popover: {
            title: 'Catálogo de Patos Primordiais',
            description: 'Esta é a tela principal para gerenciar todos os Patos Primordiais catalogados. Aqui você pode visualizar, editar e catalogar novos espécimes.'
          }
        },
        {
          element: '#catalog-stats',
          popover: {
            title: 'Cards de Estatísticas',
            description: 'Estes cards mostram um resumo dos patos catalogados: total, distribuição por status de hibernação e estatísticas de mutações.'
          }
        },
        {
          element: '#catalog-new-btn',
          popover: {
            title: 'Catalogar Novo Pato',
            description: 'Clique aqui para catalogar um novo Pato Primordial. O formulário incluirá localização GPS, status de hibernação, características físicas e superpoderes.'
          }
        },
        {
          element: '#catalog-grid',
          popover: {
            title: 'Listagem de Patos',
            description: 'Visualize todos os patos catalogados em cards. Patos capturados não podem ser editados ou excluídos. Use os botões de ação para gerenciar patos não capturados.'
          }
        }
      ]
      
      const driverObj = this.createDriver(steps, 'catalog')
      driverObj.drive()
    },
    async loadDucks() {
      await this.duckStore.fetchDucks(this.currentPage, this.filters)
    },
    async onPageChange(page) {
      this.currentPage = page
      await this.loadDucks()
    },
    applyFilters() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      
      this.debounceTimer = setTimeout(async () => {
        this.currentPage = 1
        await this.loadDucks()
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
@import './PrimordialDucks.scss';
</style>