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

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <HeaderUbeer />

  <div class="min-h-screen pt-24 bg-[#f3e9dc] text-neutral-800">
    <div class="container mx-auto px-4 py-10 flex flex-col items-center">

      <div class="bg-[#c69c74] rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div class="text-red-600 text-6xl mb-4">❌</div>

        <h1 class="text-2xl font-bold text-neutral-800 mb-4">Paiement annulé</h1>

        <p class="text-neutral-600 mb-6">
          Votre paiement a été annulé. Aucun frais n'a été prélevé. Vous pouvez retourner à votre panier pour finaliser votre commande.
        </p>

        <div class="space-y-3">
          <button
            @click="goToCart"
            class="bg-[#f3e9dc] text-neutral-800 px-6 py-3 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition w-full font-medium"
          >
            Retourner au panier
          </button>

          <button
            @click="goToCatalogue"
            class="bg-[#f3e9dc] text-neutral-800 px-6 py-3 rounded-full shadow-md hover:bg-[#c69c74] transition w-full"
          >
            Continuer mes achats
          </button>

          <button
            @click="goToHome"
            class="bg-[#f3e9dc] text-neutral-800 px-6 py-3 rounded-full shadow-md hover:bg-[#c69c74] transition w-full"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>

      <!-- Message d'aide -->
      <div class="mt-6 text-center text-neutral-600">
        <p class="text-sm">
          💡 Besoin d'aide ? Vos articles sont toujours dans votre panier
        </p>
      </div>
    </div>
  </div>
</template>
