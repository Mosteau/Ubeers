<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchBeers } from '@/services/api';
import { useRouter } from 'vue-router';
import type { Beer } from '@/types/Beer';
import HeaderUbeer from '@/components/HeaderUbeer.vue';
import ModalAddPanier from '@/components/ModalAddPanier.vue';
import { useCartCount } from '@/composables/useCartCount';

const { isAuthenticated } = useAuth0();
const beers = ref<Beer[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const API_URL = import.meta.env.VITE_API_URL;
const showPopup = ref(false);
const popupMessage = ref('');
const router = useRouter();
const { updateCartCount } = useCartCount();

onMounted(async () => {
  if (!isAuthenticated.value) {
    error.value = "Veuillez vous connecter pour voir le catalogue";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    beers.value = await fetchBeers();
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Une erreur inattendue s'est produite";
    }
  } finally {
    loading.value = false;
  }
});

const addToCart = (beer: Beer) => {
  const cart = JSON.parse(localStorage.getItem("ubeers_cart") || "[]");
  const existingItem = cart.find((item: any) => item.beer.id === beer.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ beer, quantity: 1 });
  }

  localStorage.setItem("ubeers_cart", JSON.stringify(cart));
  updateCartCount();

  popupMessage.value = `${beer.label} a été ajouté au panier !`;
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
  updateCartCount();
};

const goToCart = () => {
  showPopup.value = false;
  router.push('/panier');
  updateCartCount();
};

const viewDetails = (beerId: number) => {
  router.push(`/beer/${beerId}`);
};

// Gestion des erreurs d'image
// const handleImageError = (event: Event) => {
//   if (event.target && 'src' in event.target) {
//     (event.target as HTMLImageElement).src = '/fallback-beer.png';
//   }
// };
</script>

<template>
  <HeaderUbeer />

  <!-- Fond -->
  <div class="min-h-screen pt-24 bg-[#f3e9dc] text-neutral-800">
    <div class="container mx-auto px-4 py-10">

      <!-- Chargement / erreur -->
      <div v-if="loading" class="text-center text-neutral-800 text-lg">Chargement des bières...</div>
      <div v-if="error" class="text-center text-red-600 font-semibold">{{ error }}</div>

      <!-- Catalogue -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        <div
          v-for="beer in beers"
          :key="beer.id"
          class="bg-[#c69c74] rounded-xl shadow-md hover:shadow-lg transition-all p-5 flex flex-col items-center"
        >
          <h3 class="text-lg font-semibold text-neutral-800 mb-3 text-center tracking-wide">
            {{ beer.label }}
          </h3>

          <img
            :src="`${API_URL}${beer.imageUrl}`"
            :alt="beer.label"
            @error="handleImageError"
            @click="viewDetails(beer.id)"
            class="w-36 h-36 object-cover mb-4 rounded-md cursor-pointer hover:opacity-90 transition"
          />

          <div class="text-sm text-neutral-600 text-center space-y-1">
            <p><span class="font-medium">Brasserie :</span> {{ beer.brewery }}</p>
            <p><span class="font-medium">Type :</span> {{ beer.type }}</p>
            <p><span class="font-medium">Alcool :</span> {{ beer.alcoholPercent ? beer.alcoholPercent + '%' : 'N/A' }}</p>
            <p class="text-base font-bold text-neutral-800 mt-2">{{ beer.price }}€</p>
          </div>

          <div class="flex items-center justify-center gap-3 mt-4">
            <button
              @click="viewDetails(beer.id)"
              class="bg-[#f3e9dc] text-neutral-800 px-4 py-2 rounded-full shadow-md hover:bg-[#c69c74] transition"
            >
              Voir plus
            </button>
            <button
              @click="addToCart(beer)"
              class="bg-[#f3e9dc] text-neutral-800 px-4 py-2 rounded-full shadow-md hover:bg-[#c69c74] transition"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modale ajout panier -->
  <ModalAddPanier
    v-if="showPopup"
    :message="popupMessage"
    :showCartButton="true"
    @close="closePopup"
    @goToCart="goToCart"
  />
</template>
