const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(items) {
    return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: { name: item.name },
                unit_amount: item.price * 100, // en centimes
            },
            quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
    });
}

module.exports = { createCheckoutSession };
