<script setup lang="ts">
import { useRouter } from 'vue-router'
import HeaderUbeer from '@/components/HeaderUbeer.vue'

const router = useRouter()

const goToCart = () => {
  router.push('/panier')
}

const goToCatalogue = () => {
  router.push('/catalogue')
}
</script>

<template>
  <HeaderUbeer />
  <div class="bg-white min-h-screen">
    <div class="container mx-auto py-10 pt-24 flex flex-col items-center">
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
        <div class="text-red-600 text-6xl mb-4">❌</div>
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Paiement annulé</h1>
        <p class="text-gray-600 mb-6">
          Votre paiement a été annulé. Vous pouvez retourner à votre panier pour finaliser votre commande.
        </p>
        <div class="space-y-3">
          <button
            @click="goToCart"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full"
          >
            Retourner au panier
          </button>
          <button
            @click="goToCatalogue"
            class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition w-full"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
