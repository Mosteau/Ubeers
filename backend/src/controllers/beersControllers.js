const tables = require("../tables");

// récupérer toutes les bières
const browse = async (req, res, next) => {
  try {
    const beers = await tables.beer.readAll();
    res.json(beers);
  } catch (err) {
    next(err);
  }
};

// récupérer une bière en particulier
const read = async (req, res, next) => {
  try {
    const beer = await tables.beer.read(req.params.id);
    if (beer == null) {
      res.sendStatus(404);
    } else {
      res.json(beer);
    }
  } catch (err) {
    next(err);
  }
};

// ajouter une bière
const add = async (req, res, next) => {
  const beer = req.body;
  try {
    const insertId = await tables.beer.create(beer);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// modifier une bière
const edit = async (req, res, next) => {
  const beer = req.body;
  try {
    await tables.beer.update(req.params.id, beer);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

// exporter les fonctions du contrôleur
module.exports = {
  browse,
  read,
  add,
  edit,
};
