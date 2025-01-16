const AbstractManager = require("./AbstractManager");

class UsersManager extends AbstractManager {
  constructor() {
    super({ table: "users" });
  }

  async create(user) {
    const { googleId, email, name, phoneNumber, address, zipCode, city } = user;

    const result = await this.database.query(
      `INSERT INTO ${this.table} (google_id, email, name, phone_number, address, zip_code, city)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [googleId, email, name, phoneNumber, address, zipCode, city]
    );
    return result.rows[0].id;
  }

  async read(id) {
    const result = await this.database.query(
      `SELECT id, google_id AS "googleId", email, name, phone_number AS "phoneNumber", address, zip_code AS "zipCode", city, created_at AS "createdAt"
       FROM ${this.table}
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async update(id, user) {
    const { googleId, email, name, phoneNumber, address, zipCode, city } = user;

    const result = await this.database.query(
      `UPDATE ${this.table}
       SET google_id = $1, email = $2, name = $3, phone_number = $4, address = $5, zip_code = $6, city = $7
       WHERE id = $8
       RETURNING id`,
      [googleId, email, name, phoneNumber, address, zipCode, city, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows.length > 0;
  }
}

module.exports = UsersManager;
