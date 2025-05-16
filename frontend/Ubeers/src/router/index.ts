import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import CatalogueUbeers from '@/views/CatalogueUbeers.vue';
import BeerDetails from '@/views/BeerDetails.vue';
import AddBeer from '@/views/AddBeer.vue';
import Cart from '@/views/Cart.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/catalogue',
    name: 'CatalogueUbeers',
    component: CatalogueUbeers
  },
  {
    path: '/beers/:id',
    name: 'BeerDetails',
    component: BeerDetails
  },
  {
    path: '/addBeer',
    name: 'AddBeer',
    component: AddBeer
  },
  {
    path: '/panier',
    name: 'Panier',
    component: Cart
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
