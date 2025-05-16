<script lang='ts' setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { useCartCount } from '@/composables/useCartCount';

const { loginWithRedirect, logout, isAuthenticated }= useAuth0();
const { cartCount } = useCartCount();

const login = () => {
  loginWithRedirect();
};

const handleLogout = () => {
  logout();
}
</script>

<template>
  <header class="bg-white/10 backdrop-blur-md fixed top-0 w-full z-50 shadow-md border-b border-white/20">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <!-- Logo -->
      <router-link to="/">
        <h1 class="text-2xl font-bold text-white tracking-wide">Ubeers</h1>
      </router-link>
      <!-- Nav + Auth -->
      <div class="flex items-center space-x-4">
        <nav class="flex space-x-4">
          <router-link to="/addbeer" class="text-white hover:text-cyan-300 transition font-medium">Ajouter une bière</router-link>
          <router-link to="/catalogue" class="text-white hover:text-cyan-300 transition font-medium">Catalogue</router-link>
          <router-link to="/panier" class="text-white hover:text-cyan-300 transition font-medium">Panier</router-link>
        </nav>

        <button
          v-if="!isAuthenticated"
          @click="login"
          class="bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700 transition"
        >
          Log in
        </button>
        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

