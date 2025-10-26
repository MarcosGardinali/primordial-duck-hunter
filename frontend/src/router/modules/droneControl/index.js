export default [
  {
    path: '/drone-control',
    name: 'DroneControl',
    component: () => import('@/views/modules/DroneControl/DroneControl.vue'),
    meta: { title: 'Controle do Drone', subtitle: 'Missões de captura' }
  }
]