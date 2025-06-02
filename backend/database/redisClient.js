const { createClient } = require("redis");

// Configuration pour Upstash Redis avec TLS
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    tls: process.env.REDIS_URL?.startsWith("rediss://") ? true : false,
    rejectUnauthorized: false,
  },
});

redisClient.on("error", (err) => {
  console.error("Erreur de connexion Redis:", err);
});

redisClient.on("connect", () => {
  console.info("Connecté à Redis");
});

redisClient.on("ready", () => {
  console.info("Redis prêt à être utilisé");
});

// Connexion à Redis avec gestion d'erreur améliorée
(async () => {
  try {
    await redisClient.connect();
    console.info("Connexion Redis établie avec succès");
  } catch (error) {
    console.error("Impossible de se connecter à Redis:", error);
    console.warn("L'application continuera sans Redis");
  }
})();

// Gestion de la fermeture propre de la connexion
process.on("SIGINT", async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.info("Connexion Redis fermée");
    }
  } catch (error) {
    console.error("Erreur lors de la fermeture Redis:", error);
  }
});

module.exports = redisClient;
