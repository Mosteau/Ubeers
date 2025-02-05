// Load the express module to create a web application

const express = require("express");
const path = require("path");
const { auth } = require("express-oauth2-jwt-bearer");

const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/assets",
  express.static(path.join(__dirname, "..", "public", "assets"))
);

// Auth0 configuration
const jwtCheck = auth({
  audience: "http://ubeers.com",
  issuerBaseURL: "https://dev-2b3l1vyfg2d4azrk.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

app.get("*", (req, res, next) => {
  console.info("User is authorized");
  next();
});

// Enforce JWT authentication on all endpoints
app.use(jwtCheck);

// Define a secured route
app.get("/authorized", (req, res) => {
  res.send("Secured Resource");
});

const router = require("./router");

// Mount the API routes under the "/api" endpoint
app.use("/api", router);
/* ************************************************************************* */

// Middleware for Error Logging (Uncomment to enable)

// Define a middleware login errors
const logErrors = (err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  console.error("on req:", req.method, req.path);
  next(err);
};

// Mount the logErrors middleware globally
app.use(logErrors);

// Define a middleware for error handling
app.use((err, req, res) => {
  console.error(`Erreur sur ${req.method} ${req.path}:`, err);

  // Erreurs d'authentification Auth0
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: "error",
      code: "UNAUTHORIZED",
      message: "Token invalide ou expiré",
    });
  }

  // Erreurs de validation des données
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Données invalides",
      details: err.details,
    });
  }

  // Erreurs de base de données
  if (err.code === "ER_NO_REFERENCED_ROW") {
    return res.status(400).json({
      status: "error",
      code: "DATABASE_CONSTRAINT_ERROR",
      message: "Violation de contrainte de base de données",
    });
  }

  // Erreurs 404 - Resource non trouvée
  if (err.status === 404) {
    return res.status(404).json({
      status: "error",
      code: "NOT_FOUND",
      message: "Ressource non trouvée",
    });
  }

  // Erreurs de requête malformée
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      status: "error",
      code: "INVALID_JSON",
      message: "JSON malformé",
    });
  }

  // Erreur par défaut (500)
  return res.status(500).json({
    status: "error",
    code: "INTERNAL_SERVER_ERROR",
    message: "Erreur interne du serveur",
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    code: "NOT_FOUND",
    message: "Route non trouvée",
  });
});

module.exports = app;
