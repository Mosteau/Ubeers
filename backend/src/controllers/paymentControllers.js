const { createCheckoutSession } = require('../services/stripeService');

async function createSession(req, res) {
    try {
        const session = await createCheckoutSession(req.body.items);
        console.log('Session créée :', session.id); // <--- Ajoutez ceci pour débug
        res.json({ id: session.id }); // ⚠️ Ce format précis est requis
    } catch (error) {
        console.error('Erreur Stripe :', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createSession };
