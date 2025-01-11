import React, { useState } from "react";
import { Heart, ShoppingCart, FileText } from "lucide-react";

const ProductCard = ({ images, title, description, price }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNextImage = () => {
    setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Favorite Button */}
      <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm 
        hover:bg-white transition-all duration-300 group-hover:opacity-100 opacity-0">
        <Heart className="w-5 h-5 text-blue-500 transition-transform duration-300 hover:scale-110" />
      </button>

      {/* Image Carousel */}
      <div className="relative w-full h-48"> {/* Fixed height */}
        <div className="w-full h-full">
          <img
            src={images[currentImage]}
            alt={`${title} - ${currentImage + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 
              group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevImage}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 text-white"
          >
            &lt;
          </button>
          <button
            onClick={handleNextImage}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 text-white"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Description */}
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">ราคาเช่า / วัน</p>
            <p className="text-2xl font-bold text-blue-500">
              ฿{price.toLocaleString()}
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              พร้อมให้เช่า
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 
            text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-300 
            transform hover:translate-y-[-2px] active:translate-y-[0px]">
            <ShoppingCart className="w-5 h-5" />
            <span>เพิ่มลงตะกร้า</span>
          </button>
          <button className="flex items-center justify-center p-2.5 border-2 border-gray-200 
            dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 
            dark:hover:bg-gray-700 transition-all duration-300">
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
