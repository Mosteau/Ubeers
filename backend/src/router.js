const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import itemControllers module for handling item-related operations
const beersControllers = require("./controllers/beersControllers");

// route for beers
router.get("/beers", beersControllers.browse);
router.get("/beers/:id", beersControllers.read);
router.post("/beers", beersControllers.add);
router.put("/beers/:id", beersControllers.edit);

/* ************************************************************************* */

module.exports = router;
