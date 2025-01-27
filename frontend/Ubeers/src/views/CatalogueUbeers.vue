<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { fetchBeers } from '@/services/api';
import type { Beer } from '@/types/Beer';

const beers = ref<Beer[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

onMounted(async () => {
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
</script>
<template>
  <div class="container-catalogue-ubeers">
    <h1>Beers catalog</h1>

    <div v-if="loading">Loading beers...</div>
    <div v-if="error" class="error">Une erreur s'est produite : {{ error }}</div>

    <div v-else class="beer-list">
      <div
        v-for="beer in beers"
        :key="beer.id"
        class="beer-card"
      >
        <h3>{{ beer.label }}</h3>
        <p>Type : {{ beer.type }}</p>
        <p>Alcool : {{ beer.alcohol_percent }}%</p>
        <p>Prix : {{ beer.price }}€</p>
        <router-link :to="`/beers/${beer.id}`">Voir plus</router-link>
      </div>
    </div>
  </div>
</template>
