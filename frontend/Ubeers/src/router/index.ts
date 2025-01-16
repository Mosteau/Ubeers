import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/homePage.vue';
import NotFoundPage from '../components/404Page.vue';


const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/notfound',
    name: 'NotFound',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;