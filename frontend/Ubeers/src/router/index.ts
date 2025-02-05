import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import CatalogueUbeers from '@/views/CatalogueUbeers.vue';
import BeerDetails from '@/views/BeerDetails.vue';
import AddBeer from '@/views/AddBeer.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
