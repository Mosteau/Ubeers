/* eslint-disable no-plusplus */
/* eslint-disable import/no-extraneous-dependencies */
require("dotenv").config();

const { faker } = require("@faker-js/faker");
const database = require("./database/client");

const seed = async () => {
  try {
    await database.query(
      'TRUNCATE TABLE "orderItems", orders, deliveries, beers, users RESTART IDENTITY CASCADE'
    );

    // Users - Insérer et attendre la fin
    const userQueries = [];
    for (let i = 0; i < 10; i++) {
      const phoneNumber = parseInt(faker.string.numeric(9), 10);
      const query = database.query(
        `
        INSERT INTO users 
        (google_id, firstname, lastname, email, phone_number, zip_code, city) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
        `,
        [
          faker.number.int({ min: 1, max: 1000000 }),
          faker.person.firstName(),
          faker.person.lastName(),
          faker.internet.email(),
          phoneNumber,
          parseInt(faker.location.zipCode("#####"), 10),
          faker.location.city(),
        ]
      );
      userQueries.push(query);
    }
    await Promise.all(userQueries);

    // Autres insertions
    const queries = [];

    // Beers
    for (let i = 0; i < 10; i++) {
      const query = database.query(
        `
        INSERT INTO beers 
        (label, brewery, type, alcohol_percent, price, stock_quantity, description) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          faker.commerce.productName(),
          faker.company.name(),
          faker.commerce.department(),
          faker.number.float({ min: 3, max: 12, precision: 0.1 }),
          faker.number.float({ min: 1, max: 10, precision: 0.01 }),
          faker.number.int({ min: 0, max: 1000 }),
          faker.lorem.sentence(),
        ]
      );
      queries.push(query);
    }

    // Attendre la fin de l'insertion des bières
    await Promise.all(queries);

    // Deliveries
    const deliveryQueries = [];
    for (let i = 0; i < 10; i++) {
      const query = database.query(
        `
        INSERT INTO deliveries 
        (status, user_id) 
        VALUES ($1, $2)
        RETURNING id
        `,
        [
          faker.helpers.arrayElement(["en attente", "en cours", "livrée"]),
          faker.number.int({ min: 1, max: 10 }),
        ]
      );
      deliveryQueries.push(query);
    }
    await Promise.all(deliveryQueries);

    // Orders
    const orderQueries = [];
    for (let i = 0; i < 10; i++) {
      const query = database.query(
        `
        INSERT INTO orders 
        (user_id, delivery_id, total_amount) 
        VALUES ($1, $2, $3)
        RETURNING id
        `,
        [
          faker.number.int({ min: 1, max: 10 }),
          faker.number.int({ min: 1, max: 10 }),
          faker.number.float({ min: 10, max: 100, precision: 0.01 }),
        ]
      );
      orderQueries.push(query);
    }
    await Promise.all(orderQueries);

    // OrderItems
    const orderItemQueries = [];
    for (let i = 0; i < 20; i++) {
      const query = database.query(
        `
        INSERT INTO "orderItems" 
        (order_id, beer_id, quantity, unit_price) 
        VALUES ($1, $2, $3, $4)
        `,
        [
          faker.number.int({ min: 1, max: 10 }),
          faker.number.int({ min: 1, max: 10 }),
          faker.number.int({ min: 1, max: 10 }),
          faker.number.float({ min: 1, max: 10, precision: 0.01 }),
        ]
      );
      orderItemQueries.push(query);
    }
    await Promise.all(orderItemQueries);

    // eslint-disable-next-line no-restricted-syntax
    console.log("Base de données remplie avec succès !");
  } catch (err) {
    console.error(
      "Erreur lors du remplissage de la base de données:",
      err.message
    );
  } finally {
    database.end();
  }
};

seed();
