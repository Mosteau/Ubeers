/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// Load environment variables from .env file
require("dotenv").config();

// Import database client
const database = require("./database/client");

const seed = async () => {
  try {
    // Declare an array to store the query promises
    const queries = [];

    // ************************************************************************* //
    // Generating Seed Data

    // Optional: Truncate tables (remove existing data)
    await database.query("DELETE FROM beers");

    // Bières à insérer
    const beers = [
      {
        label: "La Blonde des Flandres",
        brewery: "Brasserie Dupont",
        type: "Blonde",
        alcohol_percent: 6.5,
        price: 4.5,
        stock_quantity: 120,
        description:
          "Une bière blonde belge aux arômes maltés et légèrement épicés.",
        image_url: "/assets/images/beer1.jpeg",
      },
      {
        label: "Brune Mystique",
        brewery: "Brasserie Chimay",
        type: "Brune",
        alcohol_percent: 7.2,
        price: 5.2,
        stock_quantity: 90,
        description:
          "Une bière brune trappiste aux notes de caramel et chocolat.",
        image_url: "/assets/images/beer2.webp",
      },
      {
        label: "Triple d'Abbaye",
        brewery: "Brasserie Westmalle",
        type: "Triple",
        alcohol_percent: 9.5,
        price: 5.8,
        stock_quantity: 75,
        description:
          "Une bière puissante et fruitée aux saveurs d'agrumes et d'épices.",
        image_url: "/assets/images/beer3.webp",
      },
      {
        label: "IPA du Mont Blanc",
        brewery: "Brasserie du Mont Blanc",
        type: "IPA",
        alcohol_percent: 6.8,
        price: 4.9,
        stock_quantity: 100,
        description:
          "Une IPA rafraîchissante avec des notes d'agrumes et une amertume prononcée.",
        image_url: "/assets/images/Beer4.jpg",
      },
      {
        label: "Stout Noire Ébène",
        brewery: "Brasserie Guinness",
        type: "Stout",
        alcohol_percent: 4.2,
        price: 3.9,
        stock_quantity: 150,
        description:
          "Un stout crémeux aux notes torréfiées de café et chocolat noir.",
        image_url: "/assets/images/beer5.jpeg",
      },
      {
        label: "Ambrée des Moines",
        brewery: "Brasserie Leffe",
        type: "Ambrée",
        alcohol_percent: 6.6,
        price: 4.3,
        stock_quantity: 110,
        description: "Une ambrée aux saveurs de caramel et de fruits secs.",
        image_url: "/assets/images/beer1.jpeg",
      },
      {
        label: "Rousse Celtique",
        brewery: "Brasserie Brittany Beer",
        type: "Rousse",
        alcohol_percent: 5.5,
        price: 4.7,
        stock_quantity: 95,
        description: "Une bière rousse aux arômes maltés et légèrement épicés.",
        image_url: "/assets/images/beer2.webp",
      },
      {
        label: "Pilsner Royale",
        brewery: "Brasserie Pilsner Urquell",
        type: "Pilsner",
        alcohol_percent: 5.0,
        price: 3.5,
        stock_quantity: 180,
        description:
          "Une bière légère et dorée aux notes florales et herbacées.",
        image_url: "/assets/images/beer3.webp",
      },
      {
        label: "Bière Blanche Alpin",
        brewery: "Brasserie Edelweiss",
        type: "Blanche",
        alcohol_percent: 4.7,
        price: 4.0,
        stock_quantity: 130,
        description:
          "Une bière blanche légère aux notes d’orange et de coriandre.",
        image_url: "/assets/images/Beer4.jpg",
      },
      {
        label: "Gueuze Lambic Tradition",
        brewery: "Brasserie Cantillon",
        type: "Lambic",
        alcohol_percent: 5.0,
        price: 6.2,
        stock_quantity: 50,
        description:
          "Une bière acidulée et pétillante aux saveurs de fruits sauvages.",
        image_url: "/assets/images/beer5.jpeg",
      },
    ];

    // Insertion des bières dans la base de données
    for (const beer of beers) {
      queries.push(
        database.query(
          "INSERT INTO beers (label, brewery, type, alcohol_percent, price, stock_quantity, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [
            beer.label,
            beer.brewery,
            beer.type,
            beer.alcohol_percent,
            beer.price,
            beer.stock_quantity,
            beer.description,
            beer.image_url,
          ]
        )
      );
    }

    // Attendre la fin de toutes les requêtes d'insertion
    await Promise.all(queries);

    // Fermeture de la connexion à la base de données
    database.end();

    console.info("🎉 Base de données remplie avec des bières ! 🍺");
  } catch (err) {
    console.error("Error filling the database:", err.message);
  }
};

// Exécuter la fonction de seed
seed();
