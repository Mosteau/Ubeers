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

const { getAccessTokenSilently, user } = useAuth0();
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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAccessTokenSilently()}`
    };

    if (user.value?.name) {
      (headers as Record<string, string>)['username'] = user.value.name;
    }
    if (user.value?.picture) {
      (headers as Record<string, string>)['picture'] = user.value.picture;
    }

    const response = await fetch(`${API_URL}${API_ENDPOINT}/${beer.value.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        ...beer.value,
        description: editedDescription.value
      })
    });

    if (response.ok) {
      beer.value.description = editedDescription.value;
      isEditing.value = false;
      location.reload();
    }
  } catch (err) {
    console.error('Erreur lors de la modification:', err);
  }
};
</script>

<template>
  <HeaderUbeer />
  <div class="bg-white min-h-screen">
    <div class="container mx-auto py-10 pt-24 flex flex-col items-center">
      <div v-if="loading" class="text-lg text-center text-gray-600">Chargement des détails...</div>
      <div v-if="error" class="text-center text-red-500 font-semibold">{{ error }}</div>

      <div v-else-if="beer" class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-3xl">
        <div class="flex flex-col items-center mb-8">
          <img :src="`${API_URL}${beer.imageUrl}`" :alt="beer.label" class="w-48 h-48 object-cover rounded-lg shadow-md mb-4"/>
          <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ beer.label }}</h1>
        </div>

        <div class="text-lg space-y-3 text-gray-700 mb-6">
          <p><span class="font-bold text-green-600">Brasserie:</span> {{ beer.brewery }}</p>
          <p><span class="font-bold text-green-600">Type:</span> {{ beer.type }}</p>
          <p><span class="font-bold text-green-600">Alcool:</span> {{ beer.alcoholPercent }}%</p>
          <p class="text-xl font-bold text-green-600">{{ beer.price }}€</p>
          <p><span class="font-bold text-green-600">Stock disponible:</span> {{ beer.stockQuantity }}</p>
        </div>

        <!-- Section Description avec édition -->
        <div class="mt-6">
          <span class="font-bold text-green-600">Description:</span>
          <template v-if="!isEditing">
            <p class="mt-2 text-gray-700">{{ beer.description }}</p>
            <button @click="startEditing" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Modifier la description
            </button>
            <div v-if="beer.lastUpdate" class="mt-2 text-sm text-gray-500">
              Dernière modification: {{ typeof beer.lastUpdate === 'object' ? (beer.lastUpdate as any)?.data?.user || "inconnu" : beer.lastUpdate }}
            </div>
          </template>

          <template v-else>
            <textarea v-model="editedDescription" class="w-full h-24 p-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
            <div class="mt-3 flex justify-between">
              <button @click="saveDescription" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Sauvegarder
              </button>
              <button @click="isEditing = false" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                Annuler
              </button>
            </div>
          </template>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-between">
          <router-link to="/catalogue" class="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition">
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
