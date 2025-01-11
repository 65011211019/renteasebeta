import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";

const Hero = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-purple-900">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className={`relative z-10 text-center px-6 transition-all duration-1000 transform 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Animated Logo */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
            animate-gradient-x tracking-tight">
            Rent Ease
          </h1>
        </div>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-12 
          leading-relaxed">
          เช่าง่าย ได้ทุกอย่าง ประหยัดทุกบาท! 
          <span className="block mt-2 text-gray-400">
            แพลตฟอร์มเช่าของใช้ที่คุณต้องลอง
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          {!loggedInUser && (
            <Link to="/signup">
              <button className="group relative w-full sm:w-auto inline-flex items-center justify-center 
                px-8 py-3 text-lg font-medium text-white bg-gradient-to-r 
                from-blue-500 to-purple-600 rounded-full overflow-hidden 
                transition-all duration-300 hover:scale-105 hover:shadow-lg 
                hover:shadow-purple-500/25">
                <span className="relative flex items-center gap-2">
                  สมัครสมาชิก
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 
                    group-hover:translate-x-1" />
                </span>
              </button>
            </Link>
          )}

          <Link to="/all-products">
            <button className="group relative w-full sm:w-auto inline-flex items-center justify-center 
              px-8 py-3 text-lg font-medium text-white border-2 border-white/20 
              rounded-full overflow-hidden transition-all duration-300 
              hover:border-white/40 hover:scale-105 hover:bg-white/10">
              <span className="relative flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                ดูสินค้าทั้งหมด
              </span>
            </button>
          </Link>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
};

export default Hero;