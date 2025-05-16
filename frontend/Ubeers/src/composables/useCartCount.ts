import { ref, onMounted } from 'vue';

const cartCount = ref(0);

export function useCartCount() {
  // Met à jour le compteur d'articles du panier
  const updateCartCount = () => {
    const stored = localStorage.getItem('ubeers_cart');
    if (stored) {
      try {
        const cart = JSON.parse(stored);
        cartCount.value = Array.isArray(cart)
          ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
          : 0;
      } catch {
        cartCount.value = 0;
      }
    } else {
      cartCount.value = 0;
    }
  };

  // Met à jour le compteur au montage et lors des changements du localStorage
  onMounted(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
  });

  return { cartCount, updateCartCount };
}
