export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/modules/Dashboard/Dashboard.vue'),
    meta: { title: 'Dashboard', subtitle: 'Bem-vindo de volta!' }
  }
]