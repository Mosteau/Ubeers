<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true
  },
  showCartButton:{
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'goToCart']);

const onClose = () => {
  emit('close');
};

const onGoToCart = () => {
  emit('goToCart');
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-[#c69c74] p-6 rounded-lg shadow-lg text-center">
      <p class="text-lg font-semibold mb-4 text-neutral-800">{{ message }}</p>
      <div class="flex justify-center gap-4">
        <button
          @click="onClose"
          class="bg-[#f3e9dc] text-neutral-800 py-2 px-4 rounded-lg shadow-md hover:bg-[#c69c74] transition"
        >
          OK
        </button>
        <button
          v-if="showCartButton"
          @click="onGoToCart"
          class="bg-[#f3e9dc] text-neutral-800 py-2 px-4 rounded-lg shadow-md hover:bg-[#c69c74] transition"
        >
          Voir panier
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.bg-black {
  background-color: rgba(0, 0, 0, 0.5);
}
.z-50 {
  z-index: 50;
}
</style>
