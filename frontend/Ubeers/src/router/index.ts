import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'

// Imports statiques
import Homepage from '../views/Homepage.vue'
import AddBeer from '../views/AddBeer.vue'
import CatalogueUbeers from '../views/CatalogueUbeers.vue'
import Cart from '../views/Cart.vue'
import BeerDetails from '../views/BeerDetails.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue'
import PaymentCancel from '../views/PaymentCancel.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Homepage
    },
    {
      path: '/addbeer',
      name: 'AddBeer',
      component: AddBeer,
      beforeEnter: authGuard
    },
    {
      path: '/catalogue',
      name: 'Catalogue',
      component: CatalogueUbeers,
      beforeEnter: authGuard
    },
    {
      path: '/panier',
      name: 'Cart',
      component: Cart,
      beforeEnter: authGuard
    },
    {
      path: '/beer/:id',
      name: 'BeerDetails',
      component: BeerDetails,
      beforeEnter: authGuard
    },
    {
      path: '/payment/success',
      name: 'PaymentSuccess',
      component: PaymentSuccess
    },
    {
      path: '/payment/cancel',
      name: 'PaymentCancel',
      component: PaymentCancel
    }
  ]
})

export default router
