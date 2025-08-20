const db = require('../config/db');

const Category = {
  getAll: (callback) => {
    db.query('SELECT * FROM categories', callback);
  },
  create: (name, callback) => {
    db.query('INSERT INTO categories (name) VALUES (?)', [name], callback);
  }
};

module.exports = Category;
