import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export async function checkout(items: { name: string; price: number; quantity: number }[]) {
  const stripe = await stripePromise;
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });

  const data = await response.json();
  console.log('Réponse fetch Stripe :', data); // <---- LOG complet

  const sessionId = data.id;
  console.log('Session ID lu depuis frontend :', sessionId);

  return stripe?.redirectToCheckout({ sessionId });
}
