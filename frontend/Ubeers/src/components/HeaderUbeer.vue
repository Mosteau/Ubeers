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
  <header class="header-ubeer">
    <h1>Ubeers</h1>
      <div>
        <router-link to="/catalogue">Catalogue</router-link>
      </div>
      <div v-if="!isAuthenticated">
        <button @click="login">Log in</button>
      </div>
      <div v-if="isAuthenticated">
        <button @click="handleLogout">Logout</button>
      </div>
  </header>
</template>

<style scoped>
.header-ubeer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
</style>
