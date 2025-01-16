const tables = require("../tables");

// Créer un utilisateur
// eslint-disable-next-line consistent-return
const create = async (req, res, next) => {
  try {
    const { googleId, email, name, phoneNumber, address, zipCode, city } =
      req.body;

    if (!googleId || !email || !name) {
      return res.status(400).json({
        message: "Les champs googleId, email et name sont obligatoires",
      });
    }

    const insertId = await tables.users.create({
      googleId,
      email,
      name,
      phoneNumber,
      address,
      zipCode,
      city,
    });

    res.status(201).json({ id: insertId });
  } catch (err) {
    next(err);
  }
};

// Lire un utilisateur par son ID
const read = async (req, res, next) => {
  try {
    const user = await tables.users.read(req.params.id);
    if (user == null) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

// Mettre à jour un utilisateur
const update = async (req, res, next) => {
  try {
    const user = await tables.users.update(req.params.id, req.body);
    if (user == null) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
};

// Supprimer un utilisateur
const destroy = async (req, res, next) => {
  try {
    const deleted = await tables.users.delete(req.params.id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  read,
  update,
  destroy,
};
