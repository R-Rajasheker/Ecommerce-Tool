const Category = require('../models/categoryModel');

exports.getCategories = (req, res) => {
  Category.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  Category.create(name, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Category created', id: result.insertId });
  });
};
