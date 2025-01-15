import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/homePage.vue';
import userLogin from '../components/userLogin.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/login',
    name: 'userLogin',
    component: userLogin
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
