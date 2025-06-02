<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import HeaderUbeer from "@/components/HeaderUbeer.vue";
import type { Beer } from "@/types/Beer";
import { useCartCount } from "@/composables/useCartCount";

const { isAuthenticated } = useAuth0();
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL;
const { updateCartCount } = useCartCount();

// Panier stocké dans le localStorage
const cart = ref<{ beer: Beer; quantity: number }[]>([]);
const error = ref<string | null>(null);

const loadCart = () => {
  const stored = localStorage.getItem("ubeers_cart");
  cart.value = stored ? JSON.parse(stored) : [];
};

const saveCart = () => {
  localStorage.setItem("ubeers_cart", JSON.stringify(cart.value));
};

const removeFromCart = (beerId: number) => {
  cart.value = cart.value.filter((item) => item.beer.id !== beerId);
  saveCart();
  updateCartCount();
};

const updateQuantity = (beerId: number, qty: number) => {
  const item = cart.value.find((i) => i.beer.id === beerId);
  if (item) {
    item.quantity = Math.max(1, qty);
    saveCart();
  }
  updateCartCount();
};

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.beer.price * item.quantity, 0)
);

const goToCatalogue = () => {
  router.push("/catalogue");
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
  <div class="bg-[#f3e9dc] bg-opacity-70 backdrop-blur-md min-h-screen text-neutral-800">
    <div class="container mx-auto py-10 pt-24 flex flex-col items-center">
      <h1 class="text-3xl font-bold text-neutral-800 mb-6">Votre panier</h1>
      <div v-if="error" class="text-red-500 font-semibold">{{ error }}</div>
      <div v-else>
        <div v-if="cart.length === 0" class="text-lg text-neutral-800 text-center mb-8">
          Votre panier est vide.<br />
          <button @click="goToCatalogue" class="mt-4 bg-[#f3e9dc] text-neutral-800 px-4 py-2 rounded-lg hover:bg-[#c69c74] transition">
            Voir le catalogue
          </button>
        </div>
        <div v-else class="w-full max-w-3xl bg-[#c69c74] rounded-xl shadow-lg p-6">
          <table class="min-w-full divide-y divide-amber-800 mb-6">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-neutral-800 uppercase">Bière</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-neutral-800 uppercase">Prix</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-neutral-800 uppercase">Quantité</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-neutral-800 uppercase">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart" :key="item.beer.id" class="border-b border-amber-800">
                <td class="flex items-center py-3">
                  <img :src="`${API_URL}${item.beer.imageUrl}`" :alt="item.beer.label" class="w-16 h-16 object-cover rounded-lg mr-4" />
                  <span class="font-semibold text-neutral-800 pr-0.5">{{ item.beer.label }}</span>

                </td>
                <td class="py-3">{{ item.beer.price }} €</td>
                <td class="py-3">
                  <input
                    type="number"
                    min="1"
                    v-model.number="item.quantity"
                    @change="updateQuantity(item.beer.id, item.quantity)"
                    class="w-12 p-1 rounded text-neutral-800 bg-[#f3e9dc]"

                  />
                </td>
                <td class="py-3">{{ (item.beer.price * item.quantity).toFixed(2) }} €</td>
                <td class="py-3">
                  <button @click="removeFromCart(item.beer.id)" class="bg-[#f3e9dc] text-neutral-800 px-3 py-1 rounded shadow-md hover:bg-[#c69c74] transition">
                    Retirer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold text-neutral-800">Total :</span>
            <span class="text-2xl font-bold text-neutral-800">{{ total.toFixed(2) }} €</span>
          </div>
          <div class="mt-6 flex justify-end">
            <button class="bg-[#f3e9dc] text-neutral-800 px-6 py-2 rounded-lg shadow-md hover:bg-[#c69c74] transition" disabled>
              Commander (bientôt)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
