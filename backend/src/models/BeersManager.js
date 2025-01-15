const AbstractManager = require("./AbstractManager");

class BeersManager extends AbstractManager {
  constructor() {
    super({ table: "beers" });
  }

  async readAll() {
    const result = await this.database.query(
      `SELECT id, 
              label, 
              brewery, 
              type, 
              alcohol_percent AS "alcoholPercent", 
              price, 
              stock_quantity AS "stockQuantity", 
              description 
       FROM ${this.table}`
    );
    return result.rows;
  }

  async read(id) {
    const result = await this.database.query(
      `SELECT id, 
              label, 
              brewery, 
              type, 
              alcohol_percent AS "alcoholPercent", 
              price, 
              stock_quantity AS "stockQuantity", 
              description 
       FROM ${this.table} 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(beer) {
    const {
      label,
      brewery,
      type,
      alcoholPercent,
      price,
      stockQuantity,
      description,
    } = beer;

    const result = await this.database.query(
      `INSERT INTO ${this.table} 
        (label, brewery, type, alcohol_percent, price, stock_quantity, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [label, brewery, type, alcoholPercent, price, stockQuantity, description]
    );
    return result.rows[0].id;
  }

  async delete(id) {
    const client = await this.database.connect();

    try {
      await client.query("BEGIN");

      await client.query(`DELETE FROM "orderItems" WHERE beer_id = $1`, [id]);

      const result = await client.query(
        `DELETE FROM ${this.table} WHERE id = $1 RETURNING id`,
        [id]
      );

      await client.query("COMMIT");

      return result.rows.length > 0;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Erreur lors de la suppression:", err);
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = BeersManager;
