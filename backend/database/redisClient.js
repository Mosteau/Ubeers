const { createClient } = require("redis");

// Configuration à partir des variables d'environnement
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Erreur de connexion Redis:", err);
});

redisClient.on("connect", () => {
  console.info("Connecté à Redis");
});

// Connexion à Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Impossible de se connecter à Redis:", error);
  }
})();

// Gestion de la fermeture propre de la connexion
process.on("SIGINT", async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    console.info("Connexion Redis fermée");
  }
});

module.exports = redisClient;
