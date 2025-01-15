require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const migrate = async () => {
  const initialClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "postgres",
  });

  try {
    await initialClient.connect();

    // Supprimer et créer la base de données
    await initialClient.query(`DROP DATABASE IF EXISTS ${DB_NAME}`);
    await initialClient.query(`CREATE DATABASE ${DB_NAME}`);
    await initialClient.end();

    // Connexion à la nouvelle base de données
    const client = new Client({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    await client.connect();

    // Lire et exécuter le schéma SQL
    const schema = path.join(__dirname, "database", "schema.sql");
    const sql = fs.readFileSync(schema, "utf8");
    await client.query(sql);

    console.info(`Base de données ${DB_NAME} mise à jour 🆙`);
    await client.end();
  } catch (err) {
    console.error("Erreur de migration:", err.message);
    process.exit(1);
  }
};

migrate();
