const { createCheckoutSession } = require("../services/stripeService");

async function createSession(req, res) {
  try {
    const { items } = req.body;

    // Validation des données d'entrée
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message:
          "Les articles du panier sont requis et ne peuvent pas être vides",
      });
    }

    // Validation de chaque article
    for (const item of items) {
      if (
        !item.name ||
        typeof item.price !== "number" ||
        typeof item.quantity !== "number"
      ) {
        return res.status(400).json({
          message:
            "Chaque article doit avoir un nom, un prix et une quantité valides",
        });
      }
      if (item.price <= 0 || item.quantity <= 0) {
        return res.status(400).json({
          message: "Le prix et la quantité doivent être supérieurs à zéro",
        });
      }
    }

    const session = await createCheckoutSession(items);
    console.info("Session créée :", session.id);
    return res.json({ id: session.id });
  } catch (error) {
    console.error("Erreur Stripe :", error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { createSession };
