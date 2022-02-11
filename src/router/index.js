import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/BaseLayout.vue'),
    children: [
      {
        path: '/counter',
        component: () => import('@/views/Counter.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
