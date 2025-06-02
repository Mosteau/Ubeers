
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import HeaderUbeer from "@/components/HeaderUbeer.vue";

const { isAuthenticated, getAccessTokenSilently } = useAuth0();
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL;
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const beer = ref({
  label: "",
  brewery: "",
  type: "",
  alcoholPercent: null,
  price: null,
  stockQuantity: null,
  description: "",
  imageUrl: ""
});

const error = ref<string | null>(null);
const loading = ref(false);

const addBeer = async () => {
  if (!isAuthenticated.value) {
    error.value = "Veuillez vous connecter pour ajouter une bière.";
    loading.value = true;
    return;
  }

  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(`${API_URL}${API_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...beer.value })
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de la bière");
    }
    await router.push("/catalogue");
  } catch (err) {
    console.error("Erreur lors de l'ajout:", err);
    error.value = "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <HeaderUbeer />
  <div class="bg-[#f3e9dc] bg-opacity-70 backdrop-blur-md min-h-screen text-neutral-800">
    <div class="container mx-auto py-10 pt-24 flex flex-col items-center">
      <h1 class="text-3xl font-bold text-neutral-800 mb-6">Ajouter une bière</h1>
      <div v-if="error" class="text-red-500 font-semibold">{{ error }}</div>
      <form @submit.prevent="addBeer" class="bg-[#c69c74] rounded-xl shadow-lg p-6 w-full max-w-3xl">
        <div class="space-y-4">
          <input v-model="beer.label" placeholder="Nom de la bière" class="w-full p-2 rounded-lg bg-[#f3e9dc] text-neutral-800" required />
          <input v-model="beer.brewery" placeholder="Brasserie" class="w-full p-2 rounded-lg bg-[#f3e9dc] text-neutral-800" required />
          <input v-model="beer.type" placeholder="Type" class="w-full p-2 rounded-lg bg-[#f3e9dc] text-neutral-800" required />
          <input type="number" v-model.number="beer.alcoholPercent" placeholder="Taux d'alcool (%)" class="w-full p-2 rounded-lg bg-[#f3e9dc] text-neutral-800" required />
          <input type="number" v-model.number="beer.price" placeholder="Prix (€)" class="w-full p-2 rounded-lg bg-[#f3e9dc] text-neutral-800" required />
          <input type="number" v-model.number="beer.stockQuantity" placeholder="Stock disponible" class="w-full p-2 rounded-lg bg-[#f3e9dc] text-neutral-800" required />
          <textarea v-model="beer.description" placeholder="Description" class="w-full p-2 rounded-lg bg-[#f3e9dc] text-neutral-800"></textarea>
          <input type="text" v-model="beer.imageUrl" placeholder="/assets/images/beer1.jpeg" class="w-full p-2 rounded-lg bg-[#f3e9dc] text-neutral-800" />
        </div>
        <button type="submit" :disabled="loading" class="mt-4 bg-[#f3e9dc] text-neutral-800 px-4 py-2 rounded-lg shadow-md hover:bg-[#c69c74] transition">
          {{ loading ? "Ajout en cours..." : "Ajouter la bière" }}
        </button>
      </form>
    </div>
  </div>
</template>
