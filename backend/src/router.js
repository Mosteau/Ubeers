const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import itemControllers module for handling item-related operations
const beersControllers = require("./controllers/beersControllers");
const userControllers = require("./controllers/userControllers");

// route for beers
router.get("/beers", beersControllers.browse); // test OK
router.get("/beers/:id", beersControllers.read); // test OK
router.post("/beers", beersControllers.add); // test OK
router.put("/beers/:id", beersControllers.edit); // test OK
router.delete("/beers/:id", beersControllers.destroy); // test OK

// Route pour les utilisateurs
router.post("/users", userControllers.create); // test OK

// Route sécurisée pour tester l'authentification
router.get("/authorized", (req, res) => {
  res.send("Secured Resource");
}); /* ************************************************************************* */

module.exports = router;
