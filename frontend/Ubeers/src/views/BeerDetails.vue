<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useAuth0 } from '@auth0/auth0-vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { fetchBeerById } from "@/services/api";
import type { Beer } from "@/types/Beer";
import HeaderUbeer from "@/components/HeaderUbeer.vue";

const route = useRoute();
const { isAuthenticated } = useAuth0();
const beer = ref<Beer | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const isEditing = ref(false);
const editedDescription = ref('');
const API_URL = import.meta.env.VITE_API_URL;
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;


const { getAccessTokenSilently } = useAuth0();
const router = useRouter();

onMounted(async () => {
  if (!isAuthenticated.value) {
    error.value = "Veuillez vous connecter pour voir les détails";
    loading.value = false;
    return;
  }

  try {
    const id = Number(route.params.id);
    beer.value = await fetchBeerById(id);
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

// supprimer une bière
const deleteBeer = async () => {
  if (!beer.value?.id) return;

  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(`${API_URL}${API_ENDPOINT}/${beer.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    await router.push('/catalogue');
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    error.value = "Erreur lors de la suppression de la bière";
  }
};

const startEditing = () => {
  if (beer.value) {
    editedDescription.value = beer.value.description;
    isEditing.value = true;
  }
};

const saveDescription = async () => {
  if (!beer.value?.id) return;

  try {
    const response = await fetch(`${API_URL}${API_ENDPOINT}/${beer.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAccessTokenSilently()}`
      },
      body: JSON.stringify({
        ...beer.value,
        description: editedDescription.value
      })
    });

    if (response.ok) {
      beer.value.description = editedDescription.value;
      isEditing.value = false;
    }
  } catch (err) {
    console.error('Erreur lors de la modification:', err);
  }
};
</script>
<template>
  <HeaderUbeer />
  <div class="bg-[#5B3A29] min-h-screen text-amber-300">
    <div class="container mx-auto py-10 pt-24 flex flex-col items-center">
      <div v-if="loading" class="text-lg text-center">Chargement des détails...</div>
      <div v-if="error" class="text-center text-red-500 font-semibold">{{ error }}</div>

      <div v-else-if="beer" class="bg-[#6D4C41] rounded-xl shadow-lg p-6 w-full max-w-3xl">
        <div class="flex flex-col items-center">
          <img :src="`${API_URL}${beer.imageUrl}`" :alt="beer.label" class="w-48 h-48 object-cover rounded-lg shadow-md mb-4"/>
          <h1 class="text-3xl font-bold text-white mb-4">{{ beer.label }}</h1>
        </div>

        <div class="text-lg space-y-3">
          <p><span class="font-bold text-amber-400">Brasserie:</span> {{ beer.brewery }}</p>
          <p><span class="font-bold text-amber-400">Type:</span> {{ beer.type }}</p>
          <p><span class="font-bold text-amber-400">Alcool:</span> {{ beer.alcohol_percent }}%</p>
          <p class="text-xl font-bold text-amber-500">{{ beer.price }}€</p>
          <p><span class="font-bold text-amber-400">Stock disponible:</span> {{ beer.stock_quantity }}</p>
        </div>

        <!-- Section Description avec édition -->
        <div class="mt-6">
          <span class="font-bold text-amber-400">Description:</span>
          <template v-if="!isEditing">
            <p class="mt-2">{{ beer.description }}</p>
            <button @click="startEditing" class="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Modifier la description
            </button>
          </template>

          <template v-else>
            <textarea v-model="editedDescription" class="w-full h-24 p-2 mt-2 text-black rounded-lg"></textarea>
            <div class="mt-3 flex justify-between">
              <button @click="saveDescription" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                Sauvegarder
              </button>
              <button @click="isEditing = false" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                Annuler
              </button>
            </div>
          </template>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-between">
          <router-link to="/catalogue" class="bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition">
            Retour au catalogue
          </router-link>
          <button @click="deleteBeer" class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">
            Supprimer la bière
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
