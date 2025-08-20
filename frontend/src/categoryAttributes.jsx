import React, { useState, useEffect } from "react";
import API from "./api";

function CategoryAttributes() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [newAttr, setNewAttr] = useState({
    attribute_name: "",
    attribute_type: "text",
    is_required: false,
  });

  // Fetch categories
  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
  }, []);

  // Fetch attributes for selected category
  useEffect(() => {
    if (selectedCategory) {
      API.get(`/categories/${selectedCategory}/attributes`).then((res) => setAttributes(res.data));
    }
  }, [selectedCategory]);

  // Handle add attribute
  const handleAddAttribute = () => {
    API.post(`/categories/${selectedCategory}/attributes`, newAttr).then(() => {
      setNewAttr({ attribute_name: "", attribute_type: "text", is_required: false });
      API.get(`/categories/${selectedCategory}/attributes`).then((res) => setAttributes(res.data));
    });
  };

  // Handle delete attribute
  const handleDelete = (id) => {
    API.delete(`/categories/${selectedCategory}/attributes/${id}`).then(() => {
      setAttributes(attributes.filter((attr) => attr.id !== id));
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Category Attributes</h2>

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Attributes List */}
      <ul className="mb-4">
        {attributes.map((attr) => (
          <li key={attr.id} className="flex justify-between items-center border p-2 mb-2">
            <span>
              {attr.attribute_name} ({attr.attribute_type}){" "}
              {attr.is_required ? "✅ Required" : "❌ Optional"}
            </span>
            <button
              onClick={() => handleDelete(attr.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Add Attribute Form */}
      {selectedCategory && (
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Add New Attribute</h3>
          <input
            type="text"
            placeholder="Attribute Name"
            value={newAttr.attribute_name}
            onChange={(e) => setNewAttr({ ...newAttr, attribute_name: e.target.value })}
            className="border p-2 mr-2"
          />

          <select
            value={newAttr.attribute_type}
            onChange={(e) => setNewAttr({ ...newAttr, attribute_type: e.target.value })}
            className="border p-2 mr-2"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="date">Date</option>
          </select>

          <label className="mr-2">
            <input
              type="checkbox"
              checked={newAttr.is_required}
              onChange={(e) => setNewAttr({ ...newAttr, is_required: e.target.checked })}
            />{" "}
            Required
          </label>

          <button
            onClick={handleAddAttribute}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryAttributes;
