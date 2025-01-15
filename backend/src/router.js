const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import itemControllers module for handling item-related operations
const itemControllers = require("./controllers/beersControllers");

// route for beers
router.get("/beers", itemControllers.browse);
router.get("/beers/:id", itemControllers.read);
router.post("/beers", itemControllers.add);
router.put("/beers/:id", itemControllers.edit);

/* ************************************************************************* */

module.exports = router;
