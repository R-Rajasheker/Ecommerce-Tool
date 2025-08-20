
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // DB connection

// Create a new attribute for a category
router.post("/:categoryId/attributes", (req, res) => {
  const { categoryId } = req.params;
  const { attribute_name, attribute_type, is_required } = req.body;

  if (!attribute_name) {
    return res.status(400).json({ error: "Attribute name is required" });
  }

  const sql = `
    INSERT INTO category_attributes 
    (category_id, attribute_name, attribute_type, is_required) 
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [categoryId, attribute_name, attribute_type || "text", is_required || false],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Attribute created successfully", id: result.insertId });
    }
  );
});

// Get all attributes for a category
router.get("/:categoryId/attributes", (req, res) => {
  const { categoryId } = req.params;

  const sql = `
    SELECT id, attribute_name, attribute_type, is_required
    FROM category_attributes 
    WHERE category_id = ?
  `;

  db.query(sql, [categoryId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Update an attribute by ID
router.put("/:categoryId/attributes/:attrId", (req, res) => {
  const { categoryId, attrId } = req.params;
  const { attribute_name, attribute_type, is_required } = req.body;

  const sql = `
    UPDATE category_attributes 
    SET attribute_name = ?, attribute_type = ?, is_required = ? 
    WHERE id = ? AND category_id = ?
  `;

  db.query(
    sql,
    [attribute_name, attribute_type, is_required, attrId, categoryId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Attribute updated successfully" });
    }
  );
});

// Delete an attribute
router.delete("/:categoryId/attributes/:attrId", (req, res) => {
  const { categoryId, attrId } = req.params;

  const sql = `DELETE FROM category_attributes WHERE id = ? AND category_id = ?`;

  db.query(sql, [attrId, categoryId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Attribute deleted successfully" });
  });
});

module.exports = router;

