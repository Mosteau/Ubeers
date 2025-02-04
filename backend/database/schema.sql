-- Drop tables if they exist
DROP TABLE IF EXISTS "orderItems";
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS beers;
DROP TABLE IF EXISTS users;

-- Create status enum type
CREATE TYPE status_enum AS ENUM (
    'en attente',
    'en cours',
    'livrée'
);

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id integer,
    firstname VARCHAR(60),
    lastname VARCHAR(60),
    email VARCHAR(250),
    phone_number integer,
    zip_code integer,
    city VARCHAR(60),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Beers table
CREATE TABLE beers (
    id SERIAL PRIMARY KEY,
    label VARCHAR(60),
    brewery VARCHAR(60),
    type VARCHAR(60),
    alcohol_percent DECIMAL,
    price DECIMAL,
    stock_quantity INTEGER,
    description VARCHAR(250),
    image_url VARCHAR(250)
);

-- Create Deliveries table
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    status status_enum,
    user_id INTEGER REFERENCES users(id)
);

-- Create Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    delivery_id INTEGER REFERENCES deliveries(id),
    total_amount DECIMAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create OrderItems table
CREATE TABLE "orderItems" (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    beer_id INTEGER REFERENCES beers(id),
    quantity INTEGER,
    unit_price DECIMAL
);
