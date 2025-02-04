<script lang='ts' setup>
import { useAuth0 } from '@auth0/auth0-vue';

const { getAccessTokenSilently, loginWithRedirect, logout, isAuthenticated }= useAuth0();

const login = () => {
  loginWithRedirect();
};

const handleLogout = () => {
  logout();
}

const toto = async () => {
  const token = await getAccessTokenSilently();
  console.log(token);
}
toto();
</script>

<template>
  <header class="bg-[#5B3A29] bg-opacity-50 backdrop-blur-md fixed top-0 w-full z-50 shadow-lg">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
    <h1 class="text-2xl font-bold text-amber-500">Ubeers</h1>
      <div class="flex items-center">
        <nav>
        <router-link to="/catalogue" class="text-yellow-400 hover:text-amber-300 transition font-medium">Catalogue</router-link>
        </nav>
        <button v-if="!isAuthenticated"
          @click="login"
          class="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition ml-4"
        >
          Log in
        </button>
        <button v-if="isAuthenticated"
          @click="handleLogout"
          class="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition ml-4"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>
