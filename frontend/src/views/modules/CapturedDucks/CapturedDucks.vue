<template>
    <div class="captured-ducks">
        <div class="page-header" id="captured-header">
            <h1><img src="@/assets/icons/trophy.svg" alt="Troféu" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;"> Patos Capturados</h1>
            <p>Troféus da operação de captura</p>
        </div>

        <!-- Filtros -->
        <Filters 
            v-model="filters" 
            :filters="filterConfig"
            @update:modelValue="applyFilters"
        />
        <div v-if="loading" class="loading">Carregando patos capturados...</div>

        <div v-else-if="capturedDucks.length === 0" class="no-captures" id="captured-empty">
            <h3>Nenhum pato capturado ainda</h3>
            <p>Vá para o controle do drone e capture alguns patos!</p>
        </div>

        <div v-else>            
            <div id="captured-grid">
                <CapturedDucksGrid
                    :capturedDucks="paginatedDucks"
                    @watchCaptureVideo="watchCaptureVideo"
                    @liberateDuck="handleLiberateEvent"
                />
            </div>
            
            <Pagination 
                :current-page="currentPage"
                :total-items="totalItems"
                :page-size="10"
                @page-changed="onPageChange"
            />
        </div>
    </div>
    <!-- Modal de Vídeo da Captura -->
    <CapturedVideoModal
        v-if="showVideoModal"
        :selectedDuck="selectedDuck"
        @close="closeVideoModal"
    />
    
    <!-- Modal de Confirmação de Libertação -->
    <ConfirmLiberationModal
        v-if="showConfirmationModal"
        :selectedDuck="selectedDuck"
        @close="closeConfirmationModal"
        @confirm="confirmLiberation"
    />
    
    <!-- Modal de Libertação -->
    <LiberationModal
        v-if="showLiberationModal"
        :selectedDuck="selectedDuck"
        @close="closeLiberationModal"
    />
</template>

<script>
import CapturedDucksGrid from '@/components/modules/CapturedDucks/CapturedDucksGrid/CapturedDucksGrid.vue';
import CapturedVideoModal from '@/components/modules/CapturedDucks/CapturedVideoModal/CapturedVideoModal.vue';
import ConfirmLiberationModal from '@/components/modules/CapturedDucks/ConfirmLiberationModal/ConfirmLiberationModal.vue';
import LiberationModal from '@/components/modules/CapturedDucks/LiberationModal/LiberationModal.vue';
import Filters from '@/components/shared/Filters/Filters.vue';
import Pagination from '@/components/shared/Pagination/Pagination.vue';
import { usePrimordialDuckStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { useTour } from '@/composables/useTour'

export default {
    name: 'CapturedDucks',
    components: {
        CapturedDucksGrid,
        CapturedVideoModal,
        ConfirmLiberationModal,
        LiberationModal,
        Filters,
        Pagination,
    },
    data() {
        return {
            capturedDucks: [],
            totalItems: 0,
            loading: true,
            showVideoModal: false,
            showConfirmationModal: false,
            showLiberationModal: false,
            selectedDuck: null,
            currentPage: 1,
            filters: {},
            filterConfig: [
                {
                    key: 'nickname',
                    label: 'Apelido',
                    type: 'text',
                    placeholder: 'Ex: Pato Dourado'
                },
                {
                    key: 'country',
                    label: 'País',
                    type: 'text',
                    placeholder: 'Ex: Brasil'
                },
                {
                    key: 'hibernation_status',
                    label: 'Status Original',
                    type: 'select',
                    options: [
                        { value: 'desperto', label: 'Desperto' },
                        { value: 'em_transe', label: 'Em Transe' },
                        { value: 'hibernacao_profunda', label: 'Hibernação Profunda' }
                    ]
                }
            ],
            debounceTimer: null,
            duckStore: usePrimordialDuckStore(),
            toast: useToast(),
            ...useTour()
        }
    },
    computed: {
        paginatedDucks() {
            return this.capturedDucks
        }
    },
    beforeUnmount() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
        }
    },
    async mounted() {
        await this.loadCapturedDucks()
        
        this.$nextTick(() => {
            if (this.shouldShowTour('captured-ducks')) {
                this.startTour()
            }
        })
    },
    methods: {
        async loadCapturedDucks() {
            try {
                this.loading = true
                // Simular filtros locais por enquanto
                let allDucks = await this.duckStore.fetchCapturedDucks()
                
                // Aplicar filtros
                if (this.filters.nickname) {
                    allDucks = allDucks.filter(duck => 
                        duck.nickname.toLowerCase().includes(this.filters.nickname.toLowerCase())
                    )
                }
                if (this.filters.country) {
                    allDucks = allDucks.filter(duck => 
                        duck.country.toLowerCase().includes(this.filters.country.toLowerCase())
                    )
                }
                if (this.filters.hibernation_status) {
                    allDucks = allDucks.filter(duck => 
                        duck.hibernation_status === this.filters.hibernation_status
                    )
                }
                
                // Aplicar paginação
                this.totalItems = allDucks.length
                const start = (this.currentPage - 1) * 10
                const end = start + 10
                this.capturedDucks = allDucks.slice(start, end)
            } catch (error) {
            } finally {
                this.loading = false
            }
        },
        watchCaptureVideo(duck) {
            this.selectedDuck = duck
            this.showVideoModal = true
        },
        closeVideoModal() {
            this.showVideoModal = false
            this.selectedDuck = null
        },
        handleLiberateEvent(duck) {
            this.openConfirmationModal(duck)
        },
        openConfirmationModal(duck) {
            this.selectedDuck = duck
            this.showConfirmationModal = true
        },
        closeConfirmationModal() {
            this.showConfirmationModal = false
            this.selectedDuck = null
        },
        async confirmLiberation(duck) {
            this.showConfirmationModal = false
            try {
                await this.duckStore.liberateDuck(duck.id)
                this.selectedDuck = duck
                this.showLiberationModal = true
                await this.loadCapturedDucks()
            } catch (error) {
                this.toast.error('Erro ao libertar o pato. Tente novamente.')
            }
        },
        closeLiberationModal() {
            this.showLiberationModal = false
            this.selectedDuck = null
        },
        startTour() {
            const steps = [
                {
                    element: '#captured-header',
                    popover: {
                        title: 'Patos Capturados',
                        description: 'Esta tela exibe todos os Patos Primordiais que foram capturados com sucesso durante as missões de captura.'
                    }
                }
            ]
            
            // Adicionar step baseado no estado atual
            if (this.capturedDucks.length === 0) {
                steps.push({
                    element: '#captured-empty',
                    popover: {
                        title: 'Nenhum Pato Capturado',
                        description: 'Quando não há patos capturados, esta mensagem é exibida. Vá para o Controle do Drone para capturar alguns patos!'
                    }
                })
            } else {
                steps.push({
                    element: '#captured-grid',
                    popover: {
                        title: 'Grid de Patos Capturados',
                        description: 'Visualize todos os patos capturados. Clique em "Assistir Vídeo" para ver a captura ou "Libertar" para soltar o pato de volta à natureza.'
                    }
                })
            }
            
            const driverObj = this.createDriver(steps, 'captured-ducks')
            driverObj.drive()
        },
        async onPageChange(page) {
            this.currentPage = page
            await this.loadCapturedDucks()
        },

        applyFilters() {
            // Usar debounce para evitar muitas chamadas
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer)
            }
            
            this.debounceTimer = setTimeout(async () => {
                this.currentPage = 1
                await this.loadCapturedDucks()
            }, 300)
        }
    }
}
</script>

<style scoped lang="scss">
@import 'CapturedDucks.scss';
</style>