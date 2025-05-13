const tables = require("../tables");
const logService = require("../services/logService");

const browse = async (req, res, next) => {
  try {
    console.info("Fetching beers...");
    const beers = await tables.beers.readAll();
    console.info("Beers fetched:", beers);

    // Log de la consultation (optionnel, peut générer beaucoup de logs)
    // await logService.logBeerAction('read-all', 'all', {
    //   userId: req.auth?.sub || 'anonymous',
    //   count: beers.length
    // });

    res.json(beers);
  } catch (err) {
    console.error("Error fetching beers:", err);
    next(err);
  }
};

// Récupérer une bière par son ID
const read = async (req, res, next) => {
  try {
    const beerId = req.params.id;
    const beer = await tables.beers.read(beerId);

    if (beer == null) {
      res.sendStatus(404);
    } else {
      // Log de la consultation d'une bière spécifique (optionnel)
      // await logService.logBeerAction('read', beerId, {
      //   userId: req.auth?.sub || 'anonymous'
      // });

      res.json(beer);
    }
  } catch (err) {
    next(err);
  }
};

// Ajouter une nouvelle bière
const add = async (req, res, next) => {
  try {
    const {
      label,
      brewery,
      type,
      alcoholPercent,
      price,
      stockQuantity,
      description,
      imageUrl,
    } = req.body;

    if (
      !label ||
      !brewery ||
      !type ||
      !alcoholPercent ||
      !price ||
      !stockQuantity ||
      !imageUrl
    ) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
      });
    }

    const newBeer = {
      label,
      brewery,
      type,
      alcoholPercent,
      price,
      stockQuantity,
      description,
      imageUrl,
    };

    const insertId = await tables.beers.create(newBeer);

    // Log de la création d'une nouvelle bière
    await logService.logBeerAction("create", insertId, {
      userId: req.auth?.sub || "anonymous",
      beerData: newBeer,
    });

    return res.status(201).json({ insertId });
  } catch (err) {
    return next(err);
  }
};

// Modifier une bière existante
const edit = async (req, res, next) => {
  try {
    const beerId = req.params.id;

    // Récupérer l'état actuel de la bière avant modification (optionnel)
    const oldBeer = await tables.beers.read(beerId);

    const beer = await tables.beers.update(beerId, {
      ...req.body,
      image_url: req.body.image_url,
    });

    if (beer == null) {
      res.sendStatus(404);
    } else {
      // Log de la modification
      await logService.logBeerAction("update", beerId, {
        userId: req.auth?.sub || "anonymous",
        oldBeerData: oldBeer, // Données avant modification
        newBeerData: req.body, // Nouvelles données
      });

      res.json(beer);
    }
  } catch (err) {
    console.error("Erreur lors de la modification:", err);
    next(err);
  }
};

// Supprimer une bière
const destroy = async (req, res, next) => {
  try {
    const beerId = req.params.id;

    // Récupérer les informations de la bière avant suppression
    const beerToDelete = await tables.beers.read(beerId);

    const deleted = await tables.beers.delete(beerId);

    if (deleted) {
      // Log de la suppression
      await logService.logBeerAction("delete", beerId, {
        userId: req.auth?.sub || "anonymous",
        beerData: beerToDelete, // Données de la bière supprimée
      });

      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error("Erreur lors de la suppression:", err);
    next(err);
  }
};

// Nouveau contrôleur pour récupérer les logs d'une bière spécifique
const getBeerLogs = async (req, res, next) => {
  try {
    const beerId = req.params.id;
    const logs = await logService.getBeerLogs(beerId);
    res.json(logs);
  } catch (err) {
    console.error("Erreur lors de la récupération des logs:", err);
    next(err);
  }
};

// Nouveau contrôleur pour récupérer tous les logs récents
const getAllLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const logs = await logService.getRecentLogs(limit);
    res.json(logs);
  } catch (err) {
    console.error("Erreur lors de la récupération des logs:", err);
    next(err);
  }
};

module.exports = {
  browse,
  read,
  add,
  edit,
  destroy,
  getBeerLogs,
  getAllLogs,
};
