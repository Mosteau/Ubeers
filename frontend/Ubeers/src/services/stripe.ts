import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export async function checkout(items: { name: string; price: number; quantity: number }[], accessToken?: string) {
  try {
    console.log('🚀 Démarrage du checkout Stripe...');
    console.log('Items:', items);

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe n\'a pas pu être chargé');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
      console.log('🔐 Token ajouté aux headers');
    }

    console.log('📡 Appel API vers:', `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ items }),
    });

    console.log('📝 Statut de la réponse:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API:', errorText);
      throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Réponse fetch Stripe :', data);

    if (!data.id) {
      throw new Error('Session ID manquant dans la réponse');
    }

    const sessionId = data.id;
    console.log('🎯 Session ID récupéré:', sessionId);

    const result = await stripe.redirectToCheckout({ sessionId });

    if (result.error) {
      console.error('❌ Erreur Stripe redirectToCheckout:', result.error);
      throw new Error(result.error.message);
    }

    return result;
  } catch (error) {
    console.error('💥 Erreur dans checkout:', error);
    throw error;
  }
}
