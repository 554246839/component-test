/**
 * 路由配置文件
 */
import * as VueRouter from 'vue-router'

import config from '@/constant/configs'

const baseRoutes: VueRouter.RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/config',
    name: 'Config',
    component: () => import('@/views/dynamic-config/index.vue')
  },
  {
    path: '/render',
    name: 'Render',
    component: () => import('@/views/common-render/index.vue')
  },
  {
    path: '/workflow',
    name: 'WorkflowPage',
    component: () => import('@/views/workflow/index.vue')
  }
]

const router: VueRouter.Router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(config.routeBase),

  routes: [
    ...baseRoutes
  ]
})

export default router
