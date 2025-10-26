export default [
  {
    path: '/captured-ducks',
    name: 'CapturedDucks',
    component: () => import('@/views/modules/CapturedDucks/CapturedDucks.vue'),
    meta: { title: 'Patos Capturados', subtitle: 'Troféus da operação' }
  }
]