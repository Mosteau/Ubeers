import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Homepage.vue')
    },
    {
      path: '/addbeer',
      name: 'AddBeer',
      component: () => import('../views/AddBeer.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/catalogue',
      name: 'Catalogue',
      component: () => import('../views/CatalogueUbeers.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/panier',
      name: 'Cart',
      component: () => import('../views/Cart.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/beer/:id',
      name: 'BeerDetails',
      component: () => import('../views/BeerDetails.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/payment/success',
      name: 'PaymentSuccess',
      component: () => import('../views/PaymentSuccess.vue')
    },
    {
      path: '/payment/cancel',
      name: 'PaymentCancel',
      component: () => import('../views/PaymentCancel.vue')
    }
  ]
})

export default router
