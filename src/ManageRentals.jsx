import React, { useState, useEffect } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";

const ManageRentals = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    product_desc: "",
    product_price: 0,
    category_id: "",
    stock: 0,
    product_available: 0, // Default to not available
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [oldImageId, setOldImageId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  const imgbbAPIKey = "1c0006ef8fc002b4e7177e2181f7d4fc"; // Replace with your actual key

  // Fetch user ID from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserId(parsedUser.user_id);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://rent-ease-api-beta.vercel.app/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUserProducts = async () => {
    if (userId) {
      try {
        const response = await axios.get(`https://rent-ease-api-beta.vercel.app/api/products/user_id/${userId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };

  // Fetch products after userId is set
  useEffect(() => {
    if (userId) {
      fetchUserProducts();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleAddProduct = async () => {
    if (!newProduct.product_name || !newProduct.product_price || !uploadedImageUrl) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและอัปโหลดรูปภาพ");
      return;
    }

    // Set product availability based on stock
    const productAvailability = newProduct.stock > 0 ? 1 : 0;

    try {
      const response = await axios.post("https://rent-ease-api-beta.vercel.app/api/product", {
        ...newProduct,
        image_url: uploadedImageUrl,
        product_available: productAvailability, // Automatically set based on stock
        user_id: userId, // Send user_id when adding a product
      });
      console.log("Product added:", response.data);
      setProducts((prevProducts) => [...prevProducts, response.data]);
      setNewProduct({ product_name: "", product_desc: "", product_price: 0, category_id: "", stock: 0, product_available: 0 });
      setUploadedImageUrl(null);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.product_name || !newProduct.product_price || !uploadedImageUrl) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและอัปโหลดรูปภาพ");
      return;
    }

    // Set product availability based on stock
    const productAvailability = newProduct.stock > 0 ? 1 : 0;

    try {
      const response = await axios.put(`https://rent-ease-api-beta.vercel.app/api/product/${editingProductId}`, {
        ...newProduct,
        image_url: uploadedImageUrl,
        product_available: productAvailability, // Automatically set based on stock
        user_id: userId, // Send user_id when updating a product
      });
      console.log("Product updated:", response.data);
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.product_id === editingProductId ? response.data : product))
      );
      setEditingProductId(null);
      setNewProduct({ product_name: "", product_desc: "", product_price: 0, category_id: "", stock: 0, product_available: 0 });
      setUploadedImageUrl(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`https://rent-ease-api-beta.vercel.app/api/product/${productId}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    const options = { maxSizeMB: 1, maxWidthOrHeight: 500, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append("image", compressedFile);

      if (oldImageId) {
        await axios.delete(`https://api.imgbb.com/1/delete/${oldImageId}?key=${imgbbAPIKey}`);
        console.log("Old image deleted successfully");
      }

      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, formData);
      setUploadedImageUrl(response.data.data.url);
      setOldImageId(response.data.data.id);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const handleEditClick = (product) => {
    setNewProduct({
      product_name: product.product_name,
      product_desc: product.product_desc,
      product_price: product.product_price,
      category_id: product.category_id,
      stock: product.stock,
      product_available: product.product_available,
    });
    setOldImageId(product.image_url);
    setEditingProductId(product.product_id);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold text-center text-gray-100 mb-6">จัดการการให้เช่า</h1>

      {/* Add/Update Product Section */}
      <div className="mb-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-medium mb-4 text-gray-700">{editingProductId ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</h2>
        <div className="space-y-6">
          <input
            type="text"
            name="product_name"
            placeholder="กรุณากรอกชื่อสินค้า"
            value={newProduct.product_name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="product_desc"
            placeholder="กรุณากรอกรายละเอียดสินค้า"
            value={newProduct.product_desc}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            name="product_price"
            placeholder="กรุณากรอกราคา"
            value={newProduct.product_price}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            name="stock"
            placeholder="กรุณากรอกจำนวนคงเหลือ"
            value={newProduct.stock}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            name="category_id"
            value={newProduct.category_id}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
          <div className="space-y-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {isUploading && <p className="text-sm text-gray-500">Uploading image...</p>}
          </div>
          <button
            onClick={editingProductId ? handleUpdateProduct : handleAddProduct}
            className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {editingProductId ? "อัปเดตสินค้า" : "เพิ่มสินค้า"}
          </button>
        </div>
      </div>

      {/* Product List Section */}
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-medium text-gray-700 mb-4">สินค้าของคุณ</h2>
        <ul className="space-y-6">
          {products.length === 0 ? (
            <p className="text-gray-500">ไม่มีสินค้า</p>
          ) : (
            products.map((product) => (
              <li
                key={product.product_id}
                className="p-4 bg-gray-50 border rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">{product.product_name}</p>
                  <p className="text-gray-600">{product.product_desc}</p>
                  <p className="text-gray-700">ราคา: ฿{product.product_price}</p>
                  <p className="text-gray-700">จำนวนคงเหลือ: {product.stock}</p>
                  <p className="text-gray-700">สถานะ: {product.product_available ? "พร้อมให้เช่า" : "ไม่พร้อมให้เช่า"}</p>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.product_id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    ลบ
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageRentals;
