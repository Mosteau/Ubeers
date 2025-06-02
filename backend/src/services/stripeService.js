const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(items) {
  console.info("🛒 Création de session Stripe pour items:", items);

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/payment/success`,
    cancel_url: `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/payment/cancel`,
  });
}

module.exports = { createCheckoutSession };
