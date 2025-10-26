export default [
  {
    path: '/drones',
    name: 'Drones',
    component: () => import('@/views/modules/Drones/Drones.vue'),
    meta: { title: 'Drones', subtitle: 'Gerenciamento da frota' }
  }
]