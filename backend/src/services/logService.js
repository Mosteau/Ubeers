const redisClient = require("../../database/redisClient");

// Clés Redis
const LOG_KEYS = {
  BEER_LOGS: "beer:logs", // Liste des logs
  BEER_ACTIONS: "beer:actions", // Ensemble des actions par bière
};

// TTL par défaut (1 semaine)
const DEFAULT_TTL = parseInt(process.env.REDIS_LOG_TTL, 10) || 604800;

/**
 * Service de logging pour les opérations sur les bières
 */
const logService = {
  /**
   * Enregistre une action sur une bière
   * @param {string} action - Type d'action (create, update, delete)
   * @param {number|string} beerId - ID de la bière
   * @param {object} data - Données associées à l'action
   */
  async logBeerAction(action, beerId, data = {}) {
    try {
      const timestamp = Date.now();
      const logEntry = JSON.stringify({
        action,
        beerId,
        timestamp,
        data,
        user: data.userId || "system", // Pourrait être obtenu du token JWT
      });

      // Ajouter à la liste chronologique de tous les logs
      await redisClient.lPush(LOG_KEYS.BEER_LOGS, logEntry);

      // Limiter la taille de la liste à 1000 entrées
      await redisClient.lTrim(LOG_KEYS.BEER_LOGS, 0, 999);

      // Ajouter à l'ensemble des actions pour cette bière spécifique
      const beerActionKey = `${LOG_KEYS.BEER_ACTIONS}:${beerId}`;
      await redisClient.lPush(beerActionKey, logEntry);

      // Définir une TTL sur la clé de bière spécifique
      await redisClient.expire(beerActionKey, DEFAULT_TTL);

      console.info(`Log enregistré: ${action} sur bière ${beerId}`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du log:", error);
    }
  },

  /**
   * Récupère les logs pour une bière spécifique
   * @param {number|string} beerId - ID de la bière
   * @returns {Promise<Array>} - Liste des logs pour cette bière
   */
  async getBeerLogs(beerId) {
    try {
      const logs = await redisClient.lRange(
        `${LOG_KEYS.BEER_ACTIONS}:${beerId}`,
        0,
        -1
      );
      return logs.map((log) => JSON.parse(log));
    } catch (error) {
      console.error("Erreur lors de la récupération des logs:", error);
      return [];
    }
  },

  /**
   * Récupère tous les logs récents
   * @param {number} limit - Nombre de logs à récupérer
   * @returns {Promise<Array>} - Liste des logs récents
   */
  async getRecentLogs(limit = 100) {
    try {
      const logs = await redisClient.lRange(LOG_KEYS.BEER_LOGS, 0, limit - 1);
      return logs.map((log) => JSON.parse(log));
    } catch (error) {
      console.error("Erreur lors de la récupération des logs récents:", error);
      return [];
    }
  },
};

module.exports = logService;
