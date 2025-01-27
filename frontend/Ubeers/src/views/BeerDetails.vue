<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchBeerById } from "@/services/api";
import type { Beer } from "@/types/Beer";

const route = useRoute();
const beer = ref<Beer>({} as Beer);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

onMounted(async () => {
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
</script>


<template>
  <div class="container-beer-details">
    <div v-if="loading">Chargement des détails...</div>
    <div v-if="error" class="error">Une erreur s'est produite : {{ error }}</div>

    <div v-else>
      <h1>{{ beer.label }}</h1>
      <p>Brasserie : {{ beer.brewery }}</p>
      <p>Type : {{ beer.type }}</p>
      <p>Alcool : {{ beer.alcohol_percent }}%</p>
      <p>Prix : {{ beer.price }}€</p>
      <p>Description : {{ beer.description }}</p>
      <p>Stock disponible : {{ beer.stock_quantity }}</p>
      <router-link to="/catalogue">Retour au catalogue</router-link>
    </div>
  </div>
</template>

<style scoped>
.beer-details {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}
</style>
