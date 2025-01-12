import React, { useState, useEffect } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { 
  Plus, Package, Edit2, Trash2, X, Upload, 
  ShoppingBag, DollarSign, FileText, Archive 
} from 'lucide-react';

const ManageRentals = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    product_desc: "",
    product_price: "",
    category_id: "",
    stock: "",
    product_available: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentProductImage, setCurrentProductImage] = useState(null);

  const imgbbAPIKey = "1c0006ef8fc002b4e7177e2181f7d4fc"; // ใช้ API key เดิม

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserId(parsedUser.user_id);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    if (userId) {
      fetchUserProducts();
    }
  }, [userId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://rent-ease-api-beta.vercel.app/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const response = await axios.get(`https://rent-ease-api-beta.vercel.app/api/products/user_id/${userId}`);
      const productsWithImages = await Promise.all(
        response.data.map(async (product) => {
          try {
            const imageResponse = await axios.get(
              `https://rent-ease-api-beta.vercel.app/api/productimage/${product.product_id}`
            );
            return {
              ...product,
              image_url: imageResponse.data.product_image_url
            };
          } catch (error) {
            console.error(`Error fetching image for product ${product.product_id}:`, error);
            return {
              ...product,
              image_url: null
            };
          }
        })
      );
      setProducts(productsWithImages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "product_price" || name === "stock" ? Number(value) : value
    }));
  };

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append("image", compressedFile);

      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, formData);
      return response.data.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.product_name || !newProduct.product_price || !imageFile) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและอัปโหลดรูปภาพ");
      return;
    }

    try {
      setIsUploading(true);

      // 1. Upload image to imgbb
      const imageUrl = await handleImageUpload(imageFile);
      console.log("Image uploaded successfully:", imageUrl);

      // 2. Create product
      const productData = {
        ...newProduct,
        product_available: newProduct.stock > 0 ? 1 : 0,
        user_id: userId,
      };
      console.log("Creating product with data:", productData);

      const productResponse = await axios.post(
        "https://rent-ease-api-beta.vercel.app/api/product",
        productData
      );
      console.log("Product created successfully:", productResponse.data);

      // Use productId from response (changed from product_id to productId)
      const newProductId = productResponse.data.productId;
      console.log("New product ID:", newProductId);

      if (!newProductId) {
        throw new Error("No product ID received from server");
      }

      // 3. Create product image with correct endpoint and product ID
      const productImageData = {
        product_image_url: imageUrl,
        product_id: newProductId
      };
      console.log("Creating product image with data:", productImageData);

      // Use the correct endpoint for product images
      const imageResponse = await axios.post(
        "https://rent-ease-api-beta.vercel.app/api/productimage", // Changed from productimages to productimage
        productImageData
      );
      console.log("Product image created successfully:", imageResponse.data);

      // 4. Refresh products list
      await fetchUserProducts();

      // 5. Reset form
      setNewProduct({
        product_name: "",
        product_desc: "",
        product_price: 0,
        category_id: "",
        stock: 0,
        product_available: 0,
      });
      setImageFile(null);
      
      alert("เพิ่มสินค้าสำเร็จ");
    } catch (error) {
      console.error("Detailed error:", error);
      console.error("Response data:", error.response?.data);
      console.error("Request config:", error.config);
      
      let errorMessage = "เกิดข้อผิดพลาดในการเพิ่มสินค้า: ";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage += "ไม่พบ API ที่ต้องการเรียกใช้ กรุณาตรวจสอบ endpoint";
        } else {
          errorMessage += `${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage += "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้";
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.product_name || !newProduct.product_price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    try {
      setIsUploading(true);
  
      let imageUrl = currentProductImage;
      if (imageFile) {
        // ลบรูปภาพเดิมก่อน
        try {
          await axios.delete(`https://rent-ease-api-beta.vercel.app/api/productimage/product/${editingProductId}`);
          console.log("Old product image deleted successfully");
        } catch (imageDeleteError) {
          console.warn("Unable to delete old product image, skipping to new image upload", imageDeleteError);
        }
  
        // อัปโหลดรูปภาพใหม่
        imageUrl = await handleImageUpload(imageFile);
      }
  
      // อัปเดตข้อมูลสินค้า
      await axios.put(`https://rent-ease-api-beta.vercel.app/api/product/${editingProductId}`, {
        ...newProduct,
        product_available: newProduct.stock > 0 ? 1 : 0,
        user_id: userId,
      });
  
      // เพิ่มรูปภาพใหม่
      if (imageFile) {
        await axios.post(`https://rent-ease-api-beta.vercel.app/api/productimage`, {
          product_image_url: imageUrl,
          product_id: editingProductId
        });
      }
  
      await fetchUserProducts();
  
      setNewProduct({
        product_name: "",
        product_desc: "",
        product_price: 0,
        category_id: "",
        stock: 0,
        product_available: 0,
      });
      setImageFile(null);
      setEditingProductId(null);
      setCurrentProductImage(null);
  
      alert("อัปเดตสินค้าสำเร็จ");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสินค้า");
    } finally {
      setIsUploading(false);
    }
  };
  

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
      return;
    }
  
    try {
      // ลบรูปภาพสินค้า แต่ไม่ให้หยุดการทำงานหากลบไม่สำเร็จ
      try {
        await axios.delete(`https://rent-ease-api-beta.vercel.app/api/productimage/product/${productId}`);
        console.log("Product image deleted successfully");
      } catch (imageDeleteError) {
        console.warn("Unable to delete product image, skipping to product deletion", imageDeleteError);
      }
  
      // ลบสินค้า
      await axios.delete(`https://rent-ease-api-beta.vercel.app/api/product/${productId}`);
      setProducts(products.filter((product) => product.product_id !== productId));
      alert("ลบสินค้าสำเร็จ");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("เกิดข้อผิดพลาดในการลบสินค้า");
    }
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
    setCurrentProductImage(product.image_url);
    setEditingProductId(product.product_id);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">การจัดการการเช่า</h1>

{/* Add/Edit Product Form */}
<div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
  <div className="p-6 border-b border-gray-100">
    <h2 className="text-2xl font-semibold text-gray-800">
      {editingProductId ? "แก้ไขสินค้า" : "เพิ่มสินค้ารายการใหม่"}
    </h2>
  </div>
  
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อสินค้า
          </label>
          <input
            type="text"
            name="product_name"
            value={newProduct.product_name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="กรุณากรอกชื่อสินค้า"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ราคา
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">฿</span>
            <input
              type="number"
              name="product_price"
              value={newProduct.product_price}
              onChange={handleInputChange}
              className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            จำนวนสินค้า
          </label>
          <input
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            หมวดหมู่
          </label>
          <select
            name="category_id"
            value={newProduct.category_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            คำอธิบายสินค้า
          </label>
          <textarea
            name="product_desc"
            value={newProduct.product_desc}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            placeholder="กรุณากรอกคำอธิบายสินค้า"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รูปภาพสินค้า
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              {(currentProductImage || imageFile) ? (
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : currentProductImage}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">คลิกเพื่ออัปโหลดรูปภาพ</p>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-6 flex gap-4">
      <button
        onClick={editingProductId ? handleUpdateProduct : handleAddProduct}
        disabled={isUploading}
        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {isUploading ? "กำลังประมวลผล..." : (editingProductId ? "อัปเดตสินค้า" : "เพิ่มสินค้า")}
      </button>
      
      {editingProductId && (
        <button
          onClick={() => {
            setEditingProductId(null);
            setNewProduct({
              product_name: "",
              product_desc: "",
              product_price: 0,
              category_id: "",
              stock: 0,
              product_available: 0,
            });
            setCurrentProductImage(null);
            setImageFile(null);
          }}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          ยกเลิก
        </button>
      )}
    </div>
  </div>
</div>

{/* Products List */}
<div className="bg-white rounded-xl shadow-lg overflow-hidden">
  <div className="p-6 border-b border-gray-100">
    <h2 className="text-2xl font-semibold text-gray-800">สินค้าของคุณ</h2>
  </div>
  
  <div className="p-6">
    {products.length === 0 ? (
      <div className="text-center py-8">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">ไม่มีสินค้ารายการใด</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.product_id} className="border rounded-xl overflow-hidden bg-gray-50 hover:shadow-md transition-shadow">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.product_name}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.product_name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.product_desc}
              </p>
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-blue-600 font-semibold">
                  ฿{product.product_price}
                </div>
                <div className="text-sm text-gray-500">
                  จำนวน: {product.stock}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.product_id)}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

    </div>
  );
};

export default ManageRentals;