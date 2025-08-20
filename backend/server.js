
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Mount nested routes
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

// ----------- CATEGORY ROUTES -----------

// GET /api/categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST /api/categories
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  db.query(
    'INSERT INTO categories (name, created_at, updated_at) VALUES (?, NOW(), NOW())',
    [name],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name });
    }
  );
});

// ----------- CATEGORY ATTRIBUTES ROUTES -----------

// GET /api/category-attributes
app.get('/api/category-attributes', (req, res) => {
  const { category_id } = req.query;
  let query = `
    SELECT ca.*, c.name as category_name 
    FROM category_attributes ca 
    LEFT JOIN categories c ON ca.category_id = c.id
  `;
  let params = [];

  if (category_id) {
    query += ' WHERE ca.category_id = ?';
    params.push(category_id);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST /api/category-attributes
app.post('/api/category-attributes', (req, res) => {
  const { category_id, attribute_name, attribute_type, is_required } = req.body;

  if (!category_id || !attribute_name || !attribute_type) {
    return res.status(400).json({ 
      error: 'category_id, attribute_name, and attribute_type are required' 
    });
  }

  db.query(
    `INSERT INTO category_attributes 
     (category_id, attribute_name, attribute_type, is_required, created_at, updated_at) 
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [category_id, attribute_name, attribute_type, is_required || false],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        id: result.insertId, 
        category_id, 
        attribute_name, 
        attribute_type, 
        is_required 
      });
    }
  );
});

// ----------- PRODUCT ROUTES -----------

// GET /api/products (with attributes)
app.get('/api/products', (req, res) => {
  const query = `
    SELECT 
      p.*,
      c.name as category_name,
      GROUP_CONCAT(
        CONCAT_WS(':', ca.attribute_name, pa.value) 
        SEPARATOR ';'
      ) as attributes_string
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_attributes pa ON p.id = pa.product_id
    LEFT JOIN category_attributes ca ON pa.attribute_id = ca.id
    GROUP BY p.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Parse attributes string into object
    const productsWithAttributes = results.map(product => {
      const attributes = {};
      if (product.attributes_string) {
        product.attributes_string.split(';').forEach(attr => {
          const [key, value] = attr.split(':');
          if (key && value) attributes[key] = value;
        });
      }
      return {
        ...product,
        attributes
      };
    });

    res.json(productsWithAttributes);
  });
});

// POST /api/products
app.post('/api/products', (req, res) => {
  const { category_id, name, description, price, stock_quantity } = req.body;

  if (!category_id || !name || price === undefined) {
    return res.status(400).json({ error: 'category_id, name and price are required' });
  }

  db.query(
    `INSERT INTO products 
     (category_id, name, description, price, stock_quantity, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [category_id, name, description || null, price, stock_quantity || 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        id: result.insertId, 
        category_id, 
        name, 
        description, 
        price, 
        stock_quantity 
      });
    }
  );
});

// ----------- PRODUCT ATTRIBUTES ROUTES -----------

// GET /api/product_attributes/:productId
app.get('/api/product_attributes/:productId', (req, res) => {
  const { productId } = req.params;
  
  const query = `
    SELECT pa.*, ca.attribute_name, ca.attribute_type
    FROM product_attributes pa
    LEFT JOIN category_attributes ca ON pa.attribute_id = ca.id
    WHERE pa.product_id = ?
  `;

  db.query(query, [productId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST /api/product_attributes
app.post('/api/product_attributes', (req, res) => {
  const { product_id, attribute_id, value } = req.body;

  if (!product_id || !attribute_id || value === undefined) {
    return res.status(400).json({ error: 'product_id, attribute_id and value are required' });
  }

  db.query(
    `INSERT INTO product_attributes 
     (product_id, attribute_id, value, created_at, updated_at) 
     VALUES (?, ?, ?, NOW(), NOW()) 
     ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()`,
    [product_id, attribute_id, value],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        id: result.insertId, 
        product_id, 
        attribute_id, 
        value 
      });
    }
  );
});

// POST /api/products_attributes (bulk create product with attributes)
app.post('/api/products_attributes', async (req, res) => {
  const { product, attributes } = req.body;
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insert product
    const [productResult] = await connection.execute(
      `INSERT INTO products 
       (category_id, name, description, price, stock_quantity, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        product.category_id,
        product.name,
        product.description || null,
        product.price,
        product.stock_quantity || 0
      ]
    );

    const productId = productResult.insertId;

    // 2. Insert product attributes
    if (attributes && Object.keys(attributes).length > 0) {
      for (const [attribute_id, value] of Object.entries(attributes)) {
        if (value) {
          await connection.execute(
            `INSERT INTO product_attributes 
             (product_id, attribute_id, value, created_at, updated_at) 
             VALUES (?, ?, ?, NOW(), NOW())`,
            [productId, attribute_id, value]
          );
        }
      }
    }

    await connection.commit();
    
    // 3. Return the complete product with attributes
    const [completeProduct] = await connection.execute(
      `SELECT p.*, c.name as category_name FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [productId]
    );

    res.json(completeProduct[0]);

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// ----------- SERVER START -----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server running on http://localhost:' + PORT));

