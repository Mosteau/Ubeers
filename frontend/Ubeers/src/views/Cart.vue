<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import HeaderUbeer from "@/components/HeaderUbeer.vue";
import type { Beer } from "@/types/Beer";
import { useCartCount } from "@/composables/useCartCount";

const { isAuthenticated, getAccessTokenSilently } = useAuth0();
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL;
const { updateCartCount } = useCartCount();

// Panier stocké dans le localStorage
const cart = ref<{ beer: Beer; quantity: number }[]>([]);
const error = ref<string | null>(null);
const isProcessingPayment = ref(false);

const loadCart = () => {
  const stored = localStorage.getItem("ubeers_cart");
  cart.value = stored ? JSON.parse(stored) : [];
  updateCartCount();
};

const saveCart = () => {
  localStorage.setItem("ubeers_cart", JSON.stringify(cart.value));
  updateCartCount();
};

const removeFromCart = (beerId: number) => {
  cart.value = cart.value.filter((item) => item.beer.id !== beerId);
  saveCart();
};

const updateQuantity = (beerId: number, qty: number) => {
  const item = cart.value.find((i) => i.beer.id === beerId);
  if (item) {
    item.quantity = Math.max(1, qty);
    saveCart();
  }
};

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.beer.price * item.quantity, 0)
);

const goToCatalogue = () => {
  router.push("/catalogue");
};

const handleCheckout = async () => {
  if (cart.value.length === 0) {
    error.value = "Votre panier est vide.";
    return;
  }

  try {
    isProcessingPayment.value = true;
    error.value = null;

    // Obtenir le token d'accès
    const accessToken = await getAccessTokenSilently();

    // Préparer les items pour Stripe
    const items = cart.value.map(item => ({
      name: item.beer.label,
      price: item.beer.price,
      quantity: item.quantity
    }));

    // Rediriger vers Stripe Checkout
    await checkout(items, accessToken);

  } catch (err: unknown) {
    console.error('Erreur lors du checkout:', err);
    error.value = err instanceof Error ? err.message : "Une erreur est survenue lors du paiement.";
  } finally {
    isProcessingPayment.value = false;
  }
};

onMounted(() => {
  if (!isAuthenticated.value) {
    error.value = "Veuillez vous connecter pour accéder à votre panier.";
    return;
  }
  loadCart();
});
</script>

<template>
  <HeaderUbeer />
  <div class="bg-white min-h-screen">
    <div class="container mx-auto py-10 pt-24 flex flex-col items-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Votre panier</h1>

      <!-- Affichage des erreurs -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-3xl w-full">
        {{ error }}
      </div>

      <div v-if="!isAuthenticated" class="text-center">
        <p class="text-gray-600 mb-4">Veuillez vous connecter pour accéder à votre panier.</p>
      </div>

      <div v-else-if="cart.length === 0" class="text-center">
        <p class="text-lg text-gray-600 mb-8">Votre panier est vide.</p>
        <button
          @click="goToCatalogue"
          class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
        >
          Voir le catalogue
        </button>
      </div>

      <div v-else class="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <!-- En-tête du tableau -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">Articles dans votre panier</h2>
        </div>

        <!-- Contenu du panier -->
        <div class="p-6">
          <div class="space-y-4 mb-6">
            <div
              v-for="item in cart"
              :key="item.beer.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex items-center space-x-4 flex-1">
                <img
                  :src="`${API_URL}${item.beer.imageUrl}`"
                  :alt="item.beer.label"
                  class="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-800">{{ item.beer.label }}</h3>
                  <p class="text-gray-600">{{ item.beer.price }} € l'unité</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <label class="text-sm text-gray-600">Quantité:</label>
                  <input
                    type="number"
                    min="1"
                    v-model.number="item.quantity"
                    @change="updateQuantity(item.beer.id, item.quantity)"
                    class="w-16 p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div class="text-right min-w-[80px]">
                  <p class="font-semibold text-gray-800">{{ (item.beer.price * item.quantity).toFixed(2) }} €</p>
                </div>

                <button
                  @click="removeFromCart(item.beer.id)"
                  class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-200 text-sm"
                >
                  Retirer
                </button>
              </div>
            </div>
          </div>

          <!-- Total et bouton de paiement -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex justify-between items-center mb-6">
              <span class="text-xl font-semibold text-gray-800">Total :</span>
              <span class="text-2xl font-bold text-green-600">{{ total.toFixed(2) }} €</span>
            </div>

            <div class="flex justify-end space-x-4">
              <button
                @click="goToCatalogue"
                class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
              >
                Continuer mes achats
              </button>

              <button
                @click="handleCheckout"
                :disabled="isProcessingPayment || cart.length === 0"
                class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span v-if="isProcessingPayment">Traitement...</span>
                <span v-else>Procéder au paiement</span>
                <svg v-if="!isProcessingPayment" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
