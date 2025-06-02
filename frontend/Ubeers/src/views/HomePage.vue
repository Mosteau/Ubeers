<script lang="ts" setup>
import HeaderUbeer from '@/components/HeaderUbeer.vue';
</script>

<template>
  <div class="container-homepage flex flex-col ">
    <HeaderUbeer/>
    <div class="container-welcome flex flex-col justify-center items-center text-7xl leading-relaxed flex-1 text-white">
      <h1>Welcome to Ubeers</h1>
      <h2>Discover the best beers in the world</h2>
    </div>
  </div>
</template>

<style scopted>
  .container-homepage {
  height: 100vh;
  background-image: url('@/assets/bierefond.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.container-welcome {
  animation: glowPulse 2.5s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    text-shadow:
      2px 2px 0 #3b1d00,
      4px 4px 8px #000000aa,
      0 0 12px #d97706aa;
  }
  50% {
    text-shadow:
      2px 2px 0 #3b1d00,
      4px 4px 8px #000000aa,
      0 0 20px #b91c1c;
  }
}
</style>
