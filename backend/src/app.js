// Load the express module to create a web application

const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");

const app = express();

// eslint-disable-next-line no-restricted-syntax
console.log("Hello from the backend!");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Configure it

/* ************************************************************************* */

// CORS Handling: Why is the current code commented out and do I need to define specific allowed origins for my project?

// CORS (Cross-Origin Resource Sharing) is a security mechanism in web browsers that blocks requests from a different domain than the server.
// You may find the following magic line in forums:

// app.use(cors());

// You should NOT do that: such code uses the `cors` module to allow all origins, which can pose security issues.
// For this pedagogical template, the CORS code is commented out to show the need for defining specific allowed origins.

// To enable CORS and define allowed origins:
// 1. Install the `cors` module in the backend directory
// 2. Uncomment the line `const cors = require("cors");`
// 3. Uncomment the section `app.use(cors({ origin: [...] }))`
// 4. Be sure to only have URLs in the array with domains from which you want to allow requests.
// For example: ["http://mysite.com", "http://another-domain.com"]

/*
const cors = require("cors");

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL, // keep this one, after checking the value in `backend/.env`
      "http://mysite.com",
      "http://another-domain.com",
    ]
  })
);
*/

/* ************************************************************************* */

// Request Parsing: Understanding the purpose of this part

// Request parsing is necessary to extract data sent by the client in an HTTP request.
// For example to access the body of a POST request.
// The current code contains different parsing options as comments to demonstrate different ways of extracting data.

// 1. `express.json()`: Parses requests with JSON data.
// 2. `express.urlencoded()`: Parses requests with URL-encoded data.
// 3. `express.text()`: Parses requests with raw text data.
// 4. `express.raw()`: Parses requests with raw binary data.

// Uncomment one or more of these options depending on the format of the data sent by your client:

// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.text());
// app.use(express.raw());

/* ************************************************************************* */

// Cookies: Why and how to use the `cookie-parser` module?

// Cookies are small pieces of data stored in the client's browser. They are often used to store user-specific information or session data.

// The `cookie-parser` module allows us to parse and manage cookies in our Express application. It parses the `Cookie` header in incoming requests and populates `req.cookies` with an object containing the cookies.

// To use `cookie-parser`, make sure it is installed in `backend/package.json` (you may need to install it separately):
// npm install cookie-parser

// Then, require the module and use it as middleware in your Express application:

// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

// Once `cookie-parser` is set up, you can read and set cookies in your routes.
// For example, to set a cookie named "username" with the value "john":
// res.cookie("username", "john");

// To read the value of a cookie named "username":
// const username = req.cookies.username;

/* ************************************************************************* */

// Import the API routes from the router module
const router = require("./router");

// Mount the API routes under the "/api" endpoint
app.use("/api", router);
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

/* ************************************************************************* */

// Middleware for Error Logging (Uncomment to enable)
// Important: Error-handling middleware should be defined last, after other app.use() and routes calls.

// Define a middleware function to log errors
const logErrors = (err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  console.error("on req:", req.method, req.path);
  res.status(500).json({ error: "Une erreur interne est survenue." });
  next(err);
};
// Mount the logErrors middleware globally
app.use(logErrors);

/* ************************************************************************* */

module.exports = app;
