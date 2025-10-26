import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import landingRoutes from '@/router/modules/landing'
import loginRoutes from '@/router/modules/login'
import dashboardRoutes from '@/router/modules/dashboard'
import primordialDucksRoutes from '@/router/modules/primordialDucks'
import dronesRoutes from '@/router/modules/drones'
import superpowersRoutes from '@/router/modules/superpowers'
import captureAnalysisRoutes from '@/router/modules/captureAnalysis'
import droneControlRoutes from '@/router/modules/droneControl'
import capturedDucksRoutes from '@/router/modules/capturedDucks'
import ForgotPassword from '@/views/modules/ForgotPassword/ForgotPassword.vue'

const routes = [
  ...landingRoutes,
  ...loginRoutes,

  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  ...dashboardRoutes,
  ...primordialDucksRoutes,
  ...dronesRoutes,
  ...superpowersRoutes,
  ...captureAnalysisRoutes,
  ...droneControlRoutes,
  ...capturedDucksRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  const publicRoutes = ['Landing', 'Login', 'ForgotPassword']
  
  if (!authStore.isAuthenticated && !publicRoutes.includes(to.name)) {
    next('/login')
  } else if (authStore.isAuthenticated && to.name === 'Login') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router