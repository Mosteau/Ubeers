<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderUbeer from '@/components/HeaderUbeer.vue'
import { useCartCount } from '@/composables/useCartCount'

const router = useRouter()
const { updateCartCount } = useCartCount()

onMounted(() => {
  localStorage.removeItem('ubeers_cart')
  updateCartCount()
})

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
        <div class="text-green-600 text-6xl mb-4">✅</div>

        <h1 class="text-2xl font-bold text-neutral-800 mb-4">Paiement réussi !</h1>

        <p class="text-neutral-600 mb-6">
          Votre commande a été confirmée avec succès. Merci pour votre achat !
        </p>

        <div class="space-y-3">
          <button
            @click="goToCatalogue"
            class="bg-[#f3e9dc] text-neutral-800 px-6 py-3 rounded-full shadow-md hover:bg-green-600 hover:text-white transition w-full font-medium"
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

      <!-- Message additionnel -->
      <div class="mt-6 text-center text-neutral-600">
        <p class="text-sm">
          🍺 Votre commande sera traitée dans les plus brefs délais
        </p>
      </div>
    </div>
  </div>
</template>
