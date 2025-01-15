const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import itemControllers module for handling item-related operations
const beersControllers = require("./controllers/beersControllers");

// route for beers

router.get("/beers", beersControllers.browse); // test OK
router.get("/beers/:id", beersControllers.read); // test OK
router.post("/beers", beersControllers.add); // test OK
router.put("/beers/:id", beersControllers.edit); // test OK
router.delete("/beers/:id", beersControllers.destroy); // test OK

/* ************************************************************************* */

module.exports = router;
