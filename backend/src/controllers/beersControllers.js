const tables = require("../tables");

// Récupérer toutes les bières
const browse = async (req, res, next) => {
  try {
    const beers = await tables.beers.readAll();
    res.json(beers);
  } catch (err) {
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
  // Validation des données requises
  const {
    label,
    brewery,
    type,
    alcohol_percent: alcoholPercent,
    price,
    stock_quantity: stockQuantity,
    // description,
  } = req.body;

  if (
    !label ||
    !brewery ||
    !type ||
    !alcoholPercent ||
    !price ||
    !stockQuantity
  ) {
    res
      .status(400)
      .json({ message: "Tous les champs obligatoires doivent être remplis" });
    return;
  }

  try {
    const insertId = await tables.beers.create(req.body);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
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
