import React from "react";
import { useState, useEffect } from "react";
import API from "./api";
import CategoryManagement from "./CategoryManagement";
import ProductManagement from "./ProductManagement";
import ProductsList from "./ProductsList";
import CategoryAttributes from "./categoryAttributes"; // ✅ New page
import imgIcon from "./assets/imgg.jpg";

function App() {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);

  // Fetch all categories
  const fetchCategories = () => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  // Fetch all products
  const fetchProducts = () => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  // Fetch category attributes (all or by categoryId)
  const fetchCategoryAttributes = (categoryId = null) => {
    const url = categoryId
      ? `/category-attributes?category_id=${categoryId}`
      : "/category-attributes";
    API.get(url)
      .then((res) => setCategoryAttributes(res.data))
      .catch((err) => console.error("Error fetching attributes:", err));
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchCategoryAttributes();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h1>
  <img
    src={imgIcon}
    alt="Product Catalog"
    style={{
      width: "40px",
      height: "40px",
      verticalAlign: "middle",
      marginRight: "8px",
      borderRadius: "50%",   
      objectFit: "cover"
    }}
  />
  Product Catalog Management
</h1>



      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("categories")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              activeTab === "categories" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Category Management
        </button>
        <button
          onClick={() => setActiveTab("attributes")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              activeTab === "attributes" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Category Attributes
        </button>
        <button
          onClick={() => setActiveTab("productsForm")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              activeTab === "productsForm" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Product Management
        </button>
        <button
          onClick={() => setActiveTab("productsList")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              activeTab === "productsList" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Products
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "categories" && (
        <CategoryManagement
          categories={categories}
          fetchCategories={fetchCategories}
          fetchCategoryAttributes={fetchCategoryAttributes}
        />
      )}

      {activeTab === "attributes" && (
        <CategoryAttributes
          categories={categories}
          categoryAttributes={categoryAttributes}
          fetchCategoryAttributes={fetchCategoryAttributes}
        />
      )}

      {activeTab === "productsForm" && (
        <ProductManagement
          categories={categories}
          fetchProducts={fetchProducts}
          categoryAttributes={categoryAttributes}
          fetchCategoryAttributes={fetchCategoryAttributes}
        />
      )}

      {activeTab === "productsList" && (
        <ProductsList products={products} categories={categories} />
      )}
    </div>
  );
}

export default App;
