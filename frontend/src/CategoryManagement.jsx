import React, { useState } from "react";
import API from "./api";

function CategoryManagement({ categories, fetchCategories, fetchCategoryAttributes }) {
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryAttribute, setNewCategoryAttribute] = useState({
    category_id: "",
    attribute_name: "",
    attribute_type: "text",
    is_required: false,
  });

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return alert("Category name is required");
    try {
      await API.post("/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Category Attribute
  const handleAddCategoryAttribute = async (e) => {
    e.preventDefault();
    const { category_id, attribute_name } = newCategoryAttribute;
    if (!category_id || !attribute_name)
      return alert("Category and Attribute name are required");

    try {
      await API.post("/category-attributes", newCategoryAttribute);
      setNewCategoryAttribute({
        category_id: "",
        attribute_name: "",
        attribute_type: "text",
        is_required: false,
      });
      fetchCategoryAttributes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2 style={{ marginBottom: "20px" }}>Category Management</h2>

      {/* --- Add Category --- */}
      <form onSubmit={handleAddCategory} style={{ marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "10px" }}>➕ Add New Category</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </form>

      {/* --- Add Attribute --- */}
      <form onSubmit={handleAddCategoryAttribute} style={{ marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "10px" }}>➕ Add Attribute to Category</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: "10px" }}>
          <select
            value={newCategoryAttribute.category_id}
            onChange={(e) =>
              setNewCategoryAttribute({ ...newCategoryAttribute, category_id: e.target.value })
            }
            style={{ padding: "8px" }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Attribute Name"
            value={newCategoryAttribute.attribute_name}
            onChange={(e) =>
              setNewCategoryAttribute({ ...newCategoryAttribute, attribute_name: e.target.value })
            }
            style={{ padding: "8px" }}
          />

          <select
            value={newCategoryAttribute.attribute_type}
            onChange={(e) =>
              setNewCategoryAttribute({ ...newCategoryAttribute, attribute_type: e.target.value })
            }
            style={{ padding: "8px" }}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="date">Date</option>
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="checkbox"
              checked={newCategoryAttribute.is_required}
              onChange={(e) =>
                setNewCategoryAttribute({ ...newCategoryAttribute, is_required: e.target.checked })
              }
            />
            Required
          </label>

          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </form>

      {/* --- List Categories with Attributes --- */}
      <div>
        <h3>📂 Existing Categories</h3>
        {categories.length === 0 ? (
          <p style={{ color: "#666" }}>No categories defined yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {categories.map((cat) => (
              <li
                key={cat.id}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  border: "1px solid #eee",
                  borderRadius: "6px",
                }}
              >
                <strong>{cat.name}</strong>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CategoryManagement;
