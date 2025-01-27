<script lang="ts" setup>
import HeaderUbeer from '@/components/HeaderUbeer.vue';
</script>

<template>
  <div class="container-homepage">
    <HeaderUbeer/>
    <div class="container-welcome">
      <p>Welcome to Ubeers</p>
      <p>Discover the best beers in the world</p>
    </div>
  </div>
</template>

<style scopted>
  .container-homepage {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url('@/assets/bierefond.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.container-welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 32px;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.8);
  flex: 1;
}
</style>
