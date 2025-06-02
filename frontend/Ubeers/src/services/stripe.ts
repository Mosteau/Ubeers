import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export async function checkout(items: { name: string; price: number; quantity: number }[], accessToken?: string) {
  try {
    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error('Stripe n\'a pas pu être chargé');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Ajouter le token d'authentification si disponible
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Réponse fetch Stripe :', data);

    if (!data.id) {
      throw new Error('Session ID manquant dans la réponse du serveur');
    }

    const sessionId = data.id;
    console.log('Session ID lu depuis frontend :', sessionId);

    const result = await stripe.redirectToCheckout({ sessionId });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  } catch (error) {
    console.error('Erreur lors du checkout Stripe:', error);
    throw error;
  }
}
