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
  router.push('/panier');
  updateCartCount();
};

const viewDetails = (beerId: number) => {
  router.push(`/beer/${beerId}`);
};

// Correction finale de handleImageError
const handleImageError = (event: Event) => {
  if (event.target && 'src' in event.target) {
    (event.target as HTMLImageElement).src = '/placeholder-beer.jpg';
  }
};
</script>

<template>
  <HeaderUbeer />
  <div class="min-h-screen pt-24 bg-[#f3e9dc] text-neutral-800">
    <div class="container mx-auto px-4 py-10">
    </div>
    <div class="container mx-auto py-10 pt-24 flex flex-col items-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Catalogue des bières</h1>

      <div v-if="loading" class="text-gray-600">Chargement...</div>
      <div v-else-if="error" class="text-red-500 font-semibold">{{ error }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <div
          v-for="beer in beers"
          :key="beer.id"
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <img
            :src="`${API_URL}${beer.imageUrl}`"
            :alt="beer.label"
            class="w-full h-48 object-cover cursor-pointer"
            @click="viewDetails(beer.id)"
            @error="handleImageError"
          />
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2 cursor-pointer hover:text-green-600 transition"
                @click="viewDetails(beer.id)">
              {{ beer.label }}
            </h3>
            <p class="text-gray-600 mb-1">{{ beer.brewery }}</p>
            <p class="text-gray-600 mb-1">{{ beer.type }}</p>
            <p class="text-gray-600 mb-3">{{ beer.alcoholPercent }}% vol.</p>
            <p class="text-2xl font-bold text-green-600 mb-4">{{ beer.price }} €</p>
            <button
              @click="addToCart(beer)"
              class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalAddPanier
    v-if="showPopup"
    :message="popupMessage"
    :showCartButton="true"
    @close="closePopup"
    @goToCart="goToCart"
  />
</template>
