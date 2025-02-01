const tables = require("../tables");

// Récupérer toutes les bières
const browse = async (req, res, next) => {
  try {
    console.info("Fetching beers...");
    const beers = await tables.beers.readAll();
    res.json(beers);
  } catch (err) {
    console.error("Error fetching beers:", err);
    next(err);
  }
};

// Récupérer une bière par son ID
const read = async (req, res, next) => {
  try {
    const beer = await tables.beers.read(req.params.id);
    if (beer == null) {
      res.sendStatus(404);
    } else {
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
    } = req.body;

    if (
      !label ||
      !brewery ||
      !type ||
      !alcoholPercent ||
      !price ||
      !stockQuantity
    ) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
      });
    }

    const insertId = await tables.beers.create({
      label,
      brewery,
      type,
      alcoholPercent,
      price,
      stockQuantity,
      description,
    });

    return res.status(201).json({ insertId });
  } catch (err) {
    return next(err);
  }
};

// Modifier une bière existante
const edit = async (req, res, next) => {
  try {
    const beer = await tables.beers.update(req.params.id, req.body);
    if (beer == null) {
      res.sendStatus(404);
    } else {
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
    const deleted = await tables.beers.delete(req.params.id);

    if (deleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error("Erreur lors de la suppression:", err);
    next(err);
  }
};

module.exports = {
  browse,
  read,
  add,
  edit,
  destroy,
};
