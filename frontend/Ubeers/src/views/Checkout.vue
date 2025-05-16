<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Paiement</h1>
    <button @click="handleCheckout" class="bg-blue-500 text-white px-4 py-2 rounded">
      Payer maintenant
    </button>
  </div>
</template>

<script setup lang="ts">
import { checkout } from '@/services/stripe';

const handleCheckout = async () => {
  await checkout([
    { name: 'Bière artisanale', price: 500, quantity: 2 }
  ]);
};
</script>
