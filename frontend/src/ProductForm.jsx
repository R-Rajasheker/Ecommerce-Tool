import React, { useState, useEffect } from "react";
import API from "./api";

const ProductForm = ({ onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "" });

  // Fetch categories
  useEffect(() => {
    API.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch attributes when category changes
  useEffect(() => {
    if (selectedCategory) {
      API.get(`/categories/${selectedCategory}/attributes`)
        .then(res => setAttributes(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedCategory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", {
        ...formData,
        category_id: selectedCategory,
      });
      alert("Product created!");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Add Product</h2>

      {/* Product Name */}
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />

      {/* Price */}
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 w-full mb-2"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Dynamic Attributes */}
      {attributes.map((attr) => (
        <div key={attr.id} className="mb-2">
          <label className="block font-medium">{attr.attribute_name}</label>
          {attr.attribute_type === "text" && (
            <input
              type="text"
              name={attr.attribute_name}
              onChange={handleChange}
              className="border p-2 w-full"
              required={attr.is_required}
            />
          )}
          {attr.attribute_type === "number" && (
            <input
              type="number"
              name={attr.attribute_name}
              onChange={handleChange}
              className="border p-2 w-full"
              required={attr.is_required}
            />
          )}
          {attr.attribute_type === "boolean" && (
            <select
              name={attr.attribute_name}
              onChange={handleChange}
              className="border p-2 w-full"
              required={attr.is_required}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )}
          {attr.attribute_type === "date" && (
            <input
              type="date"
              name={attr.attribute_name}
              onChange={handleChange}
              className="border p-2 w-full"
              required={attr.is_required}
            />
          )}
        </div>
      ))}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save Product
      </button>
    </form>
  );
};

export default ProductForm;
