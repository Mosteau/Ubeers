<template>
  <HeaderUbeer />
  <div class="bg-white min-h-screen">
    <div class="container mx-auto py-20 pt-32 flex flex-col items-center text-center">
      <div class="bg-green-50 rounded-full p-6 mb-6">
        <svg class="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <h1 class="text-3xl font-bold text-gray-800 mb-4">Paiement réussi !</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-md">
        Merci pour votre commande. Votre paiement a été traité avec succès.
      </p>

      <div class="space-y-4">
        <button
          @click="goToHome"
          class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
        >
          Retour à l'accueil
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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HeaderUbeer from '@/components/HeaderUbeer.vue';
import { useCartCount } from '@/composables/useCartCount';

const router = useRouter();
const { updateCartCount } = useCartCount();

const goToHome = () => {
  router.push('/');
};

const goToCatalogue = () => {
  router.push('/catalogue');
};

onMounted(() => {
  localStorage.removeItem('ubeers_cart');
  updateCartCount();
});
</script>
