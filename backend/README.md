# E-commerce Backend

Express + MySQL backend for the Product Catalog Management tool.

## Prerequisites
- Node.js 18+
- MySQL 8+

## Environment Variables
Create a `.env` in `backend/` with:

```
DB_HOST=127.0.0.1
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_product_tool
PORT=5000
```

## Install & Run
```
npm install
npm run dev
```

## API Overview
- GET `/api/categories`
- POST `/api/categories`
- GET `/api/categories/:categoryId/attributes`
- POST `/api/categories/:categoryId/attributes`
- DELETE `/api/categories/:categoryId/attributes/:attrId`
- GET `/api/products`
- POST `/api/products`
- POST `/api/product_attributes`
