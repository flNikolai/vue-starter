import { MainLayout } from '../../../app/layouts'

export const routes = [
  {
    path: '/',
    name: 'main',
    component: async () => import('@/pages/main'),
    meta: {
      layout: MainLayout,
    },
  },
  {
    path: '/:pathMatch(.*)',
    component: async () => import('@/pages/not-found'),
    meta: {
      layout: MainLayout,
    },
  },
]
