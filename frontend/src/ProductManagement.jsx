import React, { useState } from "react";
import API from "./api";

function ProductManagement({ categories, categoryAttributes, fetchProducts, fetchCategoryAttributes }) {
  const [newProduct, setNewProduct] = useState({ category_id: "", name: "", description: "", price: "", stock_quantity: "" });
  const [newProductAttributes, setNewProductAttributes] = useState({});

  const handleProductCategoryChange = (categoryId) => {
    setNewProduct({ ...newProduct, category_id: categoryId });
    if (categoryId) {
      fetchCategoryAttributes(categoryId);
      setNewProductAttributes({});
    }
  };

  const handleProductAttributeChange = (attributeId, value) => {
    setNewProductAttributes({ ...newProductAttributes, [attributeId]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { category_id, name, price } = newProduct;
    if (!category_id || !name || !price) return alert("Category, Name and Price are required");

    try {
      const productResponse = await API.post("/products", { ...newProduct, price: parseFloat(newProduct.price), stock_quantity: parseInt(newProduct.stock_quantity || 0, 10) });
      const productId = productResponse.data.id;

      const attributePromises = Object.entries(newProductAttributes).map(([attrId, value]) => {
        if (value) return API.post("/product_attributes", { product_id: productId, attribute_id: attrId, value });
        return Promise.resolve();
      });

      await Promise.all(attributePromises);

      setNewProduct({ category_id: "", name: "", description: "", price: "", stock_quantity: "" });
      setNewProductAttributes({});
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Product Management</h2>
      <form onSubmit={handleAddProduct}>
        <div style={{ display: "flex", gap: "30px", marginBottom: "30px" }}>
          <div style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>Add New Product</h3>
            <select value={newProduct.category_id} onChange={e => handleProductCategoryChange(e.target.value)} style={{ padding: "8px", width: "50%", marginBottom: "10px" }} required>
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={{ padding: "8px", width: "100%", marginBottom: "10px" }} required />
            <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} style={{ padding: "8px", width: "100%", marginBottom: "10px", minHeight: "60px" }} />
            <input type="number" step="0.01" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={{ padding: "8px", width: "100%", marginBottom: "10px" }} required />
            <input type="number" placeholder="Stock Quantity" value={newProduct.stock_quantity} onChange={e => setNewProduct({ ...newProduct, stock_quantity: e.target.value })} style={{ padding: "8px", width: "100%" }} />
          </div>

          <div style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>Product Attributes</h3>
            {categoryAttributes.filter(attr => attr.category_id == newProduct.category_id).map(attr => (
              <div key={attr.id} style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: attr.is_required ? "bold" : "normal" }}>
                  {attr.attribute_name} {attr.is_required && "*"}
                </label>
                <input type={attr.attribute_type === "number" ? "number" : "text"} placeholder={`Enter ${attr.attribute_name}`} value={newProductAttributes[attr.id] || ""} onChange={e => handleProductAttributeChange(attr.id, e.target.value)} style={{ padding: "8px", width: "100%" }} required={attr.is_required} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px" }}>Add Product</button>
      </form>
    </div>
  );
}

export default ProductManagement;
