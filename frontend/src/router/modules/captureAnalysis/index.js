export default [
  {
    path: '/capture-analysis',
    name: 'CaptureAnalysis',
    component: () => import('@/views/modules/CaptureAnalysis/CaptureAnalysis.vue'),
    meta: { title: 'Análise de Captura', subtitle: 'Estratégias e prioridades' }
  }
]