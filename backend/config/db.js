const mysql = require('mysql2');

// Use a pool for better concurrency and to support getConnection for transactions
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ecommerce_product_tool',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test initial connectivity
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('✅ MySQL pool initialized');
    connection.release();
  }
});

module.exports = pool;
