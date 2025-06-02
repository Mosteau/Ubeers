const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(items) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // en centimes, arrondi pour éviter les erreurs de précision
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/payment/success`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
  });
}

module.exports = { createCheckoutSession };
