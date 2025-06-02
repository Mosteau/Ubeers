<template>
  <HeaderUbeer />
  <div class="bg-white min-h-screen">
    <div class="container mx-auto py-20 pt-32 flex flex-col items-center text-center">
      <div class="bg-red-50 rounded-full p-6 mb-6">
        <svg class="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>

      <h1 class="text-3xl font-bold text-gray-800 mb-4">Paiement annulé</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-md">
        Votre paiement a été annulé. Vos articles sont toujours dans votre panier.
      </p>

      <div class="space-y-4">
        <button
          @click="goToCart"
          class="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition duration-200 font-medium"
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
  router.push('/cart');
};

const goToCatalogue = () => {
  router.push('/catalogue');
};
</script>
