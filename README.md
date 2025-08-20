# E-commerce Catalog Management

Monorepo with a Node.js (Express + MySQL) backend and a React (Vite) frontend.

## Project Structure
- `backend/` – Express API (MySQL)
- `frontend/` – React + Vite app

## Prerequisites
- Node.js 18+
- MySQL 8+

## 1) Database Setup
1. Create a MySQL database (default name used by the app: `ecommerce_product_tool`).
2. Import schema:
   - Open a MySQL client and run the SQL in `backend/schema.sql`.

## 2) Backend Setup
1. Create `backend/.env` with:
```
DB_HOST=127.0.0.1
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_product_tool
PORT=5000
```
2. Install and run:
```
cd backend
npm install
npm run dev
```
The API will be at `http://localhost:5000/api`.

## 3) Frontend Setup
1. (Optional) Create `frontend/.env` to override the API URL:
```
VITE_API_URL=http://localhost:5000/api
```
2. Install and run:
```
cd frontend
npm install
npm run dev
```
The app will start on a Vite dev server (e.g., `http://localhost:5173`).

## Key API Endpoints
- Categories
  - GET `/api/categories`
  - POST `/api/categories`
  - GET `/api/categories/:categoryId/attributes`
  - POST `/api/categories/:categoryId/attributes`
  - DELETE `/api/categories/:categoryId/attributes/:attrId`
- Category Attributes (global)
  - GET `/api/category-attributes?category_id=...`
  - POST `/api/category-attributes`
- Products
  - GET `/api/products`
  - POST `/api/products`
  - GET `/api/product_attributes/:productId`
  - POST `/api/product_attributes`

## .gitignore (recommended)
Create a `.gitignore` at repository root containing:
```
# Node
node_modules/
*.log

# Backend
backend/.env

# Frontend
frontend/dist/
frontend/.env
```

## Notes
- The backend uses a MySQL pool (`mysql2`) and supports transactions on the bulk product+attributes endpoint.
- Frontend API base URL is configured via `VITE_API_URL` (falls back to `http://localhost:5000/api`).
