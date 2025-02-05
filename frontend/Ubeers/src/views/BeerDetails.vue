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


<!-- <template>
  <HeaderUbeer />
  <div class="container-beer-details">
    <div v-if="loading">Chargement des détails...</div>
    <div v-if="error" class="error">Une erreur s'est produite : {{ error }}</div>

    <div v-else-if="beer" class="beer-details">
      <img :src="`${API_URL}${beer.imageUrl}`" :alt="beer.label" />
      <h1>{{ beer.label }}</h1>
      <div class="beer-info">
        <p><span>Brasserie :</span> {{ beer.brewery }}</p>
        <p><span>Type :</span> {{ beer.type }}</p>
        <p><span>Alcool :</span> {{ beer.alcohol_percent }}%</p>
        <p class="price">{{ beer.price }}€</p>

        <div class="description-section">
          <span>Description :</span>
          <template v-if="!isEditing">
            <p>{{ beer.description }}</p>
            <button @click="startEditing" class="edit-btn">Modifier la description</button>
          </template>
          <template v-else>
            <textarea
              v-model="editedDescription"
              class="description-input"
            ></textarea>
            <div class="edit-actions">
              <button @click="saveDescription" class="save-btn">Sauvegarder</button>
              <button @click="isEditing = false" class="cancel-btn">Annuler</button>
            </div>
          </template>
        </div>

        <p><span>Stock disponible :</span> {{ beer.stock_quantity }}</p>
      </div>

      <div class="actions">
        <router-link to="/catalogue" class="back-link">Retour au catalogue</router-link>
        <button @click="deleteBeer" class="delete-btn">Supprimer la bière</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-beer-details {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #060607;
}

.beer-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
  transition: all 0.3s ease;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 30px;
  font-weight: 700;
  grid-column: 1 / -1;
}

.beer-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.beer-info p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.beer-info p:hover {
  transform: translateX(5px);
}

.beer-info span {
  font-weight: 600;
  color: #2d3748;
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price {
  font-size: 2rem !important;
  font-weight: 700;
  color: #42b883 !important;
  padding: 20px !important;
  background: #ecfdf5 !important;
  border-radius: 12px;
  text-align: center;
  margin: 20px 0;
}

.back-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 30px;
  grid-column: 1 / -1;
  text-align: center;
  width: fit-content;
}

.back-link:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.2);
}

.error {
  color: #e53e3e;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  margin-bottom: 20px;
  font-weight: 500;
}

/* Loading state */
.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #718096;
}

.description-section {
  margin: 20px 0;
}

.description-input {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 10px 0;
  font-family: inherit;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.edit-btn, .save-btn, .cancel-btn, .delete-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #4a90e2;
  color: white;
}

.save-btn {
  background-color: #42b883;
  color: white;
}

.cancel-btn {
  background-color: #64748b;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  grid-column: 1 / -1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .beer-details {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
  }

  .beer-info p {
    font-size: 1rem;
  }

  .price {
    font-size: 1.8rem !important;
  }
}

@media (max-width: 480px) {
  .container-beer-details {
    padding: 20px 10px;
  }

  h1 {
    font-size: 1.8rem;
  }
}
</style> -->
