import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!, {
  stripeAccount: undefined,
});

export async function checkout(items: { name: string; price: number; quantity: number }[], accessToken?: string) {
  try {
    console.log('🚀 Démarrage du checkout Stripe...');

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe n\'a pas pu être chargé');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.id) {
      throw new Error('Session ID manquant dans la réponse');
    }

    // Redirection vers Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: data.id
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;

  } catch (error) {
    console.error('Erreur lors du checkout:', error);
    throw error;
  }
}
