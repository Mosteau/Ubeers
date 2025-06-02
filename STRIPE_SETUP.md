# Guide de configuration Stripe pour Ubeers

## Configuration nécessaire pour tester l'intégration Stripe

### 1. Variables d'environnement Backend (`backend/.env`)

```bash
# Configuration de Stripe
STRIPE_SECRET_KEY=sk_test_... # Votre clé secrète de test Stripe
FRONTEND_URL=http://localhost:5173 # URL du frontend pour les redirections
```

### 2. Variables d'environnement Frontend (`frontend/Ubeers/.env`)

```bash
# Configuration de Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # Votre clé publique de test Stripe
VITE_API_URL=http://localhost:3310 # URL du backend
```

### 3. Obtenir les clés de test Stripe

1. Créez un compte sur [stripe.com](https://stripe.com)
2. Allez dans "Developers" > "API keys"
3. Copiez la "Publishable key" et la "Secret key" du mode test

### 4. Test de l'intégration

1. Démarrez le backend : `cd backend && npm start`
2. Démarrez le frontend : `cd frontend/Ubeers && npm run dev`
3. Accédez au catalogue et ajoutez des bières au panier
4. Allez au panier et cliquez sur "Procéder au paiement"
5. Vous serez redirigé vers Stripe Checkout

### 5. Cartes de test Stripe

Pour tester les paiements, utilisez ces numéros de carte :
- **Succès** : 4242 4242 4242 4242
- **Échec** : 4000 0000 0000 0002
- **3D Secure** : 4000 0027 6000 3184

Date d'expiration : n'importe quelle date future
CVC : n'importe quel nombre à 3 chiffres

### 6. Résolution des problèmes

- Vérifiez que les variables d'environnement sont correctement définies
- Vérifiez que les ports 3310 (backend) et 5173 (frontend) sont disponibles
- Consultez les logs de la console pour les erreurs d'authentification
- Assurez-vous que l'utilisateur est connecté via Auth0 avant d'accéder au panier

### 7. URLs de redirection configurées

- **Succès** : `http://localhost:5173/payment/success`
- **Annulation** : `http://localhost:5173/payment/cancel`

Ces URLs sont automatiquement configurées dans le service Stripe backend.
