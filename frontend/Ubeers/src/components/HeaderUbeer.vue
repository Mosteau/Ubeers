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
  <header class="bg-[#c69c74] shadow-md fixed top-0 w-full z-50">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <!-- Logo -->
      <router-link to="/">
        <h1 class="text-2xl font-bold text-neutral-800">Ubeers</h1>
      </router-link>
      <!-- Nav + Auth -->
      <div class="flex items-center space-x-4">
        <nav class="flex space-x-4">
          <router-link to="/addbeer" class="text-neutral-700 hover:text-black font-medium transition">Ajouter une bière</router-link>
          <router-link to="/catalogue" class="text-neutral-700 hover:text-black font-medium transition">Catalogue</router-link>
          <router-link to="/panier" class="text-neutral-700 hover:text-black font-medium transition">Panier</router-link>
        </nav>

        <button
          v-if="!isAuthenticated"
          @click="login"
          class="bg-[#f3e9dc] text-neutral-800 px-4 py-2 rounded-full shadow-md hover:bg-[#c69c74] transition"
        >
          Log in
        </button>
        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="bg-[#f3e9dc] text-neutral-800 px-4 py-2 rounded-full shadow-md hover:bg-[#c69c74] transition"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

