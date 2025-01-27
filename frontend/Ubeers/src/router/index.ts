import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import CatalogueUbeers from '@/views/CatalogueUbeers.vue';
import BeerDetails from '@/views/BeerDetails.vue';

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
    path: '/catalogue/:id',
    name: 'BeerDetails',
    component: BeerDetails
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
