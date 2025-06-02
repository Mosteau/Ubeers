<template>
  <HeaderUbeer />
  <div class="bg-white min-h-screen">
    <div class="container mx-auto py-20 pt-32 flex flex-col items-center text-center">
      <div class="bg-orange-50 rounded-full p-6 mb-6">
        <svg class="w-16 h-16 text-orange-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>

      <h1 class="text-3xl font-bold text-gray-800 mb-4">Paiement annulé</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-md">
        Votre paiement a été annulé. Vos articles sont toujours dans votre panier.
      </p>

      <div class="space-y-4">
        <button
          @click="goToCart"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
        >
          Retourner au panier
        </button>

        <button
          @click="goToCatalogue"
          class="block bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
        >
          Continuer mes achats
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import HeaderUbeer from '@/components/HeaderUbeer.vue';

const router = useRouter();

const goToCart = () => {
  router.push('/panier');
};

const goToCatalogue = () => {
  router.push('/catalogue');
};
</script>
