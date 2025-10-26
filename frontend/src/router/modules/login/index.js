export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/modules/Login/Login.vue'),
    meta: { title: 'Login' }
  }
]