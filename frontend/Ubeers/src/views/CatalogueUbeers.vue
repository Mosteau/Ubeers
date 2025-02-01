<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchBeers } from '@/services/api';
import type { Beer } from '@/types/Beer';

const { isAuthenticated } = useAuth0();
const beers = ref<Beer[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

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
</script>

<template>
  <div class="container-catalogue-ubeers">
    <h1>Beers catalog</h1>

    <div v-if="loading">Loading beers...</div>
    <div v-if="error" class="error">Une erreur s'est produite : {{ error }}</div>

    <div v-else class="beer-grid">
      <div
        v-for="beer in beers"
        :key="beer.id"
        class="beer-card"
      >
        <div class="beer-card-content">
          <h3>{{ beer.label }}</h3>
          <div class="beer-info">
            <p><span>Type :</span> {{ beer.type }}</p>
            <p><span>Alcool :</span> {{ beer.alcohol_percent }}%</p>
            <p class="price">{{ beer.price }}€</p>
          </div>
          <router-link :to="`/beers/${beer.id}`" class="beer-link">Voir plus</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-catalogue-ubeers {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.beer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.beer-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.beer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.beer-card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.beer-card h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #333;
}

.beer-info {
  flex-grow: 1;
}

.beer-info p {
  margin: 8px 0;
  color: #666;
}

.beer-info span {
  font-weight: bold;
  color: #444;
}

.price {
  font-size: 1.4rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 15px 0;
}

.beer-link {
  display: inline-block;
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  text-align: center;
}

.beer-link:hover {
  background-color: #3aa876;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .beer-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .beer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .beer-grid {
    grid-template-columns: 1fr;
  }
}
</style>