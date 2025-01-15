// Create CRUD for user etape 1

const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    super({ table: "user" }); // Call the constructor of AbstractManager
  }

  async create(user) {
    // Create a new user
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (firstname, lastname, email, password) VALUES (?, ?, ?, ?)`,
      [user.firstname, user.lastname, user.email, user.password]
    );

    return result; // Return the id of the created user
  }

  async read(id) {
    // Read a user
    const [result] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );

    return result; // Return the user
  }

  async readAll() {
    // Read all users
    const [result] = await this.database.query(`SELECT * FROM ${this.table}`);

    return result; // Return all users
  }

  async update(user) {
    // Update a user
    const [result] = await this.database.query(
      `UPDATE ${this.table} set firstname = ?, lastname = ?, email = ?, password = ? where id = ?`,
      [user.firstname, user.lastname, user.email, user.password, user.id]
    );

    return result; // Return the id of the updated user
  }

  async delete(id) {
    // Delete a user
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );

    return result; // Return the id of the deleted user
  }
}

module.exports = UserManager;
