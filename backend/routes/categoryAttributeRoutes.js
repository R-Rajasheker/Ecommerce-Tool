const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ➤ Create a new category attribute
router.post('/', (req, res) => {
  const { category_id, attribute_name, attribute_type, is_required } = req.body;
  const sql = `
    INSERT INTO category_attributes (category_id, attribute_name, attribute_type, is_required)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [category_id, attribute_name, attribute_type, is_required || false], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, category_id, attribute_name, attribute_type, is_required });
  });
});

// ➤ Get all attributes of a category
router.get('/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const sql = 'SELECT * FROM category_attributes WHERE category_id = ?';
  db.query(sql, [categoryId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ➤ Update a category attribute
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { attribute_name, attribute_type, is_required } = req.body;
  const sql = `
    UPDATE category_attributes
    SET attribute_name = ?, attribute_type = ?, is_required = ?
    WHERE id = ?
  `;
  db.query(sql, [attribute_name, attribute_type, is_required, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, attribute_name, attribute_type, is_required });
  });
});

// ➤ Delete a category attribute
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM category_attributes WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Attribute deleted successfully' });
  });
});

module.exports = router;
