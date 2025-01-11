import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import { Calendar, ShoppingCart, Package, ChevronLeft, Plus, Minus, User, Mail, ChevronRight } from "lucide-react";
import 'swiper/css';
import 'swiper/css/navigation';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentStartDate, setRentStartDate] = useState("");
  const [rentEndDate, setRentEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [rentalDays, setRentalDays] = useState(0);

  const getCurrentDateInLocalTime = () => {
    const currentDate = new Date();
    const localDate = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(currentDate);
    return localDate.split("/").reverse().join("-");
  };

  useEffect(() => {
    const autoRentStartDate = getCurrentDateInLocalTime();
    setRentStartDate(autoRentStartDate);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://rent-ease-api-beta.vercel.app/api/product/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct({
          id: data.product_id,
          title: data.product_name,
          description: data.product_desc,
          price: data.product_price,
          stock: data.stock,
          available: data.product_available,
          userId: data.user_id,
        });
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchProductImages = async () => {
      try {
        const response = await fetch(
          `https://rent-ease-api-beta.vercel.app/api/productimages`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product images");
        }
        const data = await response.json();
        const images = data.filter((image) => image.product_id === parseInt(id));
        setProductImages(images.map((image) => image.product_image_url));
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchUser = async (userId) => {
      try {
        const response = await fetch(
          `https://rent-ease-api-beta.vercel.app/api/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setUser({
          id: data.user_id,
          name: data.user_name,
          email: data.user_email,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const loadData = async () => {
      await fetchProduct();
      await fetchProductImages();
      if (product && product.userId) {
        await fetchUser(product.userId);
      }
    };

    loadData();
  }, [id, product?.userId]);

  const calculateTotalPrice = () => {
    if (rentStartDate && rentEndDate && product) {
      const start = new Date(rentStartDate);
      const end = new Date(rentEndDate);
      const days = (end - start) / (1000 * 60 * 60 * 24);
      const validDays = days > 0 ? days : 0;
      setRentalDays(validDays);
      setTotalPrice(validDays * product.price * quantity);
    }
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [rentStartDate, rentEndDate, quantity, product]);

  const handleQuantityChange = (type) => {
    if (!product) return;
    
    setQuantity((prev) => {
      if (type === "increase" && prev < product.stock) return prev + 1;
      if (type === "decrease" && prev > 1) return prev - 1;
      return prev;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center mb-6 text-white hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          <span>กลับไปหน้าแรก</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden relative group">
              <Swiper
                modules={[Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                className="aspect-square"
              >
                {productImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative pb-[100%]">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
                
                {/* Navigation Buttons */}
                {productImages.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button className="swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-lg flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    
                    {/* Next Button */}
                    <button className="swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-lg flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}
              </Swiper>
              
              {/* Image Counter */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {productImages.length} รูป
                </div>
              )}
            </div>

            {/* Seller Info */}
            {user && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">ข้อมูลผู้ปล่อยเช่า</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <User className="w-5 h-5 mr-3" />
                    <span>{user.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product?.title}</h1>
              <p className="text-lg text-white">{product?.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-white" />
              <span className="text-white">สินค้าคงเหลือ: {product?.stock} ชิ้น</span>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ฿{product?.price}
                <span className="text-lg text-gray-600 ml-2">/ วัน</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-gray-600">จำนวน:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Rental Dates */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <h3 className="text-lg font-semibold">ระยะเวลาการเช่า</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      วันที่เริ่มเช่า
                    </label>
                    <input
                      type="date"
                      value={rentStartDate}
                      readOnly
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      วันที่สิ้นสุด
                    </label>
                    <input
                      type="date"
                      value={rentEndDate}
                      onChange={(e) => setRentEndDate(e.target.value)}
                      min={rentStartDate}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Price */}
            {totalPrice > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">ระยะเวลา:</span>
                  <span className="font-medium">{rentalDays} วัน</span>
                </div>
                <div className="flex justify-between text-xl font-semibold">
                  <span>ราคารวมทั้งหมด:</span>
                  <span className="text-blue-600">฿{totalPrice}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => alert("เพิ่มสินค้าลงในรถเข็นเรียบร้อย!")}
                className="flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                เพิ่มในรถเข็น
              </button>
              <button
                onClick={() => alert("เริ่มการเช่าสินค้า!")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                เช่าสินค้า
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;