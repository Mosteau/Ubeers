## Vue d'ensemble

Le système Redis implémenté dans votre application Ubeers permet de stocker et gérer les logs des opérations CRUD (Create, Read, Update, Delete) sur les bières. Cette fonctionnalité offre un système de traçabilité et d'audit pour toutes les actions effectuées sur les bières.

## Architecture

### Fichiers concernés

- redisClient.js - Configuration et connexion Redis
- logService.js - Service de logging
- beersControllers.js - Contrôleurs avec intégration des logs

## Configuration Redis

### Connexion (`redisClient.js`)

````javascript
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
````

**Configuration recommandée dans `.env` :**
```env
REDIS_URL=redis://localhost:6379
REDIS_LOG_TTL=604800  # 1 semaine en secondes
```

### Gestion de la connexion

- **Connexion automatique** au démarrage de l'application
- **Gestion des erreurs** avec logs appropriés
- **Fermeture propre** lors de l'arrêt de l'application (`SIGINT`)

## Service de Logging

### Structure des données

Le `logService` utilise deux structures Redis :

#### 1. Liste globale des logs
- **Clé** : `beer:logs`
- **Type** : Liste Redis (FIFO)
- **Contenu** : Tous les logs chronologiques
- **Limite** : 1000 entrées maximum

#### 2. Logs par bière
- **Clé** : `beer:actions:{beerId}`
- **Type** : Liste Redis
- **Contenu** : Logs spécifiques à une bière
- **TTL** : 1 semaine par défaut

### Format des entrées de log

````javascript
{
  action: "create|update|delete|read-all",
  beerId: "123",
  timestamp: 1703875200000,
  data: {
    userId: "auth0|user123",
    beerData: { /* données de la bière */ },
    oldBeerData: { /* données avant modification */ },
    newBeerData: { /* nouvelles données */ }
  },
  user: "auth0|user123"
}
````

## Fonctionnalités disponibles

### 1. Enregistrement des actions

````javascript
await logService.logBeerAction(action, beerId, data);
````

**Actions supportées :**
- `create` - Création d'une nouvelle bière
- `update` - Modification d'une bière existante
- `delete` - Suppression d'une bière
- `read-all` - Consultation du catalogue (optionnel)

### 2. Récupération des logs

#### Logs d'une bière spécifique
````javascript
const logs = await logService.getBeerLogs(beerId);
````

#### Logs récents globaux
````javascript
const logs = await logService.getRecentLogs(limit);
````

## Intégration dans les contrôleurs

### Exemple : Création d'une bière

````javascript
// Dans beersControllers.js
const add = async (req, res, next) => {
  try {
    const insertId = await tables.beers.create(newBeer);
    
    // Log de la création
    await logService.logBeerAction("create", insertId, {
      userId: req.auth?.sub || "anonymous",
      beerData: newBeer,
    });
    
    return res.status(201).json({ insertId });
  } catch (err) {
    return next(err);
  }
};
````

### Exemple : Modification d'une bière

````javascript
const edit = async (req, res, next) => {
  try {
    const oldBeer = await tables.beers.read(beerId);
    const beer = await tables.beers.update(beerId, req.body);
    
    // Log de la modification
    await logService.logBeerAction("update", beerId, {
      user: req.headers.username || "no username",
      profile: req.headers.picture || "no profile picture",
      oldBeerData: oldBeer,
      newBeerData: req.body,
    });
    
    res.json(beer);
  } catch (err) {
    next(err);
  }
};
````

## Routes d'API disponibles

### Récupération des logs d'une bière
```
GET /api/beers/:id/logs
```

### Récupération de tous les logs récents
```
GET /api/beers-logs?limit=100
```

## Avantages du système

### 1. **Traçabilité complète**
- Historique de toutes les modifications
- Identification des utilisateurs
- Horodatage précis

### 2. **Performance**
- Cache en mémoire Redis très rapide
- Pas d'impact sur la base de données principale
- TTL automatique pour éviter l'accumulation

### 3. **Flexibilité**
- Données structurées en JSON
- Facilement extensible
- Requêtes rapides par bière ou globales

### 4. **Audit et conformité**
- Respect des bonnes pratiques de logging
- Données conservées pendant une période définie
- Possibilité d'export pour analyse

## Considérations de production

### Surveillance
- Monitorer l'utilisation mémoire de Redis
- Vérifier la connectivité Redis
- Surveiller les performances des opérations de log

### Sauvegarde
- Les logs Redis sont volatiles par design
- Pour une persistance long terme, considérer un export périodique
- Redis peut être configuré pour la persistance sur disque

### Sécurité
- Les logs peuvent contenir des données sensibles
- Implémenter une authentification Redis en production
- Considérer le chiffrement des données sensibles
