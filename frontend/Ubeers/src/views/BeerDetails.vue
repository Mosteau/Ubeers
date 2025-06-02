<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useAuth0 } from '@auth0/auth0-vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { fetchBeerById } from "@/services/api";
import type { Beer } from "@/types/Beer";
import HeaderUbeer from "@/components/HeaderUbeer.vue";
import { useCartCount } from "@/composables/useCartCount";

const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
const route = useRoute();
const router = useRouter();
const { updateCartCount } = useCartCount();

const beer = ref<Beer | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showModal = ref(false);
const API_URL = import.meta.env.VITE_API_URL;

onMounted(async () => {
  if (!isAuthenticated.value) {
    error.value = "Veuillez vous connecter pour voir les détails";
    loading.value = false;
    return;
  }

  try {
    const beerId = Number(route.params.id);
    if (isNaN(beerId)) {
      throw new Error("ID de bière invalide");
    }
    beer.value = await fetchBeerById(beerId);
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

const addToCart = () => {
  if (!beer.value) return;

  const cart = JSON.parse(localStorage.getItem("ubeers_cart") || "[]");
  const existingItem = cart.find((item: any) => item.beer.id === beer.value!.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ beer: beer.value, quantity: 1 });
  }

  localStorage.setItem("ubeers_cart", JSON.stringify(cart));
  updateCartCount();
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const goToCart = () => {
  router.push('/panier');
};

const deleteBeer = async () => {
  if (!beer.value || !confirm("Êtes-vous sûr de vouloir supprimer cette bière ?")) return;

  try {
    const token = await getAccessTokenSilently();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    if (user.value?.name) {
      headers['username'] = user.value.name;
    }
    if (user.value?.picture) {
      headers['picture'] = user.value.picture;
    }

    const response = await fetch(`${API_URL}/api/beers/${beer.value.id}`, {
      method: 'DELETE',
      headers
    });

    if (response.ok) {
      router.push('/catalogue');
    } else {
      throw new Error('Erreur lors de la suppression');
    }
  } catch (err) {
    console.error('Erreur:', err);
    error.value = "Erreur lors de la suppression de la bière";
  }
};
</script>

<template>
  <HeaderUbeer />
  <div class="bg-white min-h-screen">
    <div class="container mx-auto py-10 pt-24 flex flex-col items-center">
      <div v-if="loading" class="text-gray-600">Chargement...</div>
      <div v-else-if="error" class="text-red-500 font-semibold">{{ error }}</div>
      <div v-else-if="beer" class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-2xl w-full">
        <div class="flex flex-col md:flex-row gap-8">
          <img
            :src="`${API_URL}${beer.imageUrl}`"
            :alt="beer.label"
            class="w-full md:w-64 h-64 object-cover rounded-lg"
          />
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ beer.label }}</h1>
            <div class="space-y-3 text-gray-600 mb-6">
              <p><span class="font-semibold">Brasserie:</span> {{ beer.brewery }}</p>
              <p><span class="font-semibold">Type:</span> {{ beer.type }}</p>
              <p><span class="font-semibold">Taux d'alcool:</span> {{ beer.alcoholPercent }}%</p>
              <p><span class="font-semibold">Prix:</span> {{ beer.price }} €</p>
              <p><span class="font-semibold">Stock:</span> {{ beer.stockQuantity }}</p>
              <p><span class="font-semibold">Description:</span> {{ beer.description }}</p>
            </div>

            <div class="flex gap-4">
              <button
                @click="addToCart"
                class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Ajouter au panier
              </button>
              <button
                @click="deleteBeer"
                class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Produit ajouté au panier !</h3>
      <p class="text-gray-600 mb-6">{{ beer?.label }} a été ajouté à votre panier.</p>
      <div class="flex gap-3">
        <button
          @click="closeModal"
          class="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Continuer
        </button>
        <button
          @click="goToCart"
          class="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Voir le panier
        </button>
      </div>
    </div>
  </div>
</template>
