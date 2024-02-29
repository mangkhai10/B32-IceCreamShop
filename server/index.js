// imports here for express and pg
const express = require("express");
const app = express();
const pg = require("pg");
// Initializing PostgreSQL client
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_shop_db"
);

// parse the body into JS Objects
app.use(express.json())

// Define API routes
app.get('/api/flavors', async (req, res, next) => {
    try {
      const SQL = `SELECT * FROM flavors;`;
      const result = await client.query(SQL);
      res.send(result.rows);
    } catch (error) {
      next(error);
    }
  });
  app.get('/api/flavors/:id', async (req, res, next) => {
    try {
      const SQL = `SELECT * FROM flavors WHERE id=$1`
      const result = await client.query(SQL, [req.params.id]);
      res.send(result.rows[0]);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/flavors', async (req, res, next) => {
    try {
      const SQL = `INSERT INTO flavors(name) VALUES ($1) RETURNING *`
      const result = await client.query(SQL,[req.body.name]);
      res.send(result.rows[0]);
    } catch (error) {
    }
  });

  app.delete('/api/flavors/:id', async (req, res, next) => {
    try {
      const SQL = `DELETE FROM flavors WHERE id=$1`;
      const result = await client.query(SQL, [req.params.id]);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  app.put('/api/flavors/:id', async (req, res, next) => {
    try {
      const SQL = `UPDATE flavors SET name=$1 WHERE id=$2 RETURNING *`
      const result = await client.query(SQL, [req.body.name, req.params.id]);
      res.send(result.rows[0]);
    } catch (error) {
      next(error);
    }
  });

// create your init function
const init = async () => {
  // Connect to the PostgreSQL database
  await client.connect();

  // SQL script to drop existing table, create a new one, and seed initial data
  let SQL = `
    DROP TABLE IF EXISTS flavors;

    CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
    );
    
    INSERT INTO flavors (name, is_favorite) VALUES ('Vallina', true);
    insert INTO flavors (name, is_favorite) VALUES ('Raspberry', false);
    INSERT INTO flavors (name, is_favorite) VALUES ('Chocolate', true);
    INSERT INTO flavors (name, is_favorite) VALUES ('Strawberry', true)

    `;

  // Execute SQL script
  await client.query(SQL);
  console.log("Tables created and data seeded");

  // Define the port to listen on, using either environment variable or default to 3000
  const port = process.env.PORT || 3000;
  // Start the Express server
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

// init function invocation
init();
