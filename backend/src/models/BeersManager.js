const AbstractManager = require("./AbstractManager");

class BeersManager extends AbstractManager {
  constructor() {
    super({ table: "beers" });
  }

  async create(beer) {
    const [result] = await this.database.query(
      `insert into ${this.table} (name, price, image, description, stock) values (?, ?, ?, ?, ?)`,
      [beer.name, beer.price, beer.image, beer.description, beer.stock]
    );

    return result.insertId;
  }

  async read(id) {
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    return rows[0];
  }

  async readAll() {
    const [rows] = await this.database.query(`select * from ${this.table}`);

    return rows;
  }

  async update(beer) {
    const [result] = await this.database.query(
      `update ${this.table} set name = ?, price = ?, image = ?, description = ?, stock = ? where id = ?`,
      [beer.name, beer.price, beer.image, beer.description, beer.stock, beer.id]
    );

    return result.affectedRows;
  }

  async delete(id) {
    const [result] = await this.database.query(
      `delete from ${this.table} where id = ?`,
      [id]
    );

    return result.affectedRows;
  }
}

module.exports = BeersManager;
