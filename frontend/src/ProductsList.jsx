import React, { useState } from "react";

function ProductsList({ products, categories }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Products ({filteredProducts.length})</h2>

      {/* Category Filter */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: "8px 16px",
            backgroundColor: !selectedCategory ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: "8px 16px",
              backgroundColor: selectedCategory === cat.id ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px"
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {filteredProducts.map(product => (
          <div key={product.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{product.name}</h3>
            <p style={{ margin: "0 0 10px 0", color: "#666" }}>{product.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", color: "#007bff" }}>${product.price}</span>
              <span style={{ color: product.stock_quantity > 0 ? "#28a745" : "#dc3545" }}>Stock: {product.stock_quantity}</span>
            </div>
            <p style={{ margin: "10px 0 0 0", fontSize: "0.9em", color: "#888" }}>
              Category: {categories.find(c => c.id === product.category_id)?.name || 'Unknown'}
            </p>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>No products found</p>
      )}
    </div>
  );
}

export default ProductsList;
