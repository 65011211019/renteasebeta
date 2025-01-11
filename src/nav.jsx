import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown, User, Package, Settings, LogOut } from "lucide-react";

const Nav = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      fetchUserData(user.user_id);
    }
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Handle resize
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`https://rent-ease-api-beta.vercel.app/api/user/${userId}`);
      const data = await response.json();
      if (data) {
        localStorage.setItem("loggedInUser", JSON.stringify(data));
        setLoggedInUser(data);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setIsMenuOpen(false);
    localStorage.removeItem("loggedInUser");
    window.location.reload();
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 bg-black to-indigo-900 text-white border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-purple-900 font-bold text-xl">R</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  RentEase
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-8">
                <NavLink to="/">หน้าแรก</NavLink>
                <NavLink to="/product">สินค้า</NavLink>
              </div>

              <div className="flex items-center space-x-6">
                {loggedInUser ? (
                  <>
                    <CartButton itemCount={loggedInUser.cart?.itemCount} />
                    <UserMenu loggedInUser={loggedInUser} handleLogout={handleLogout} />
                  </>
                ) : (
                  <Link 
                    to="/login"
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    เข้าสู่ระบบ
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white/80" />
              ) : (
                <Menu className="w-6 h-6 text-white/80" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        
        {/* Mobile Navigation Menu */}
        <div
          className={`fixed top-16 left-0 right-0 bottom-0 bg-gradient-to-b from-purple-900 to-indigo-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full overflow-y-auto">
            <div className="px-4 py-3 space-y-3">
              {loggedInUser && (
                <div className="flex items-center space-x-3 px-2 py-3 border-b border-white/10">
                  {loggedInUser.user_imgurl ? (
                    <img
                      src={loggedInUser.user_imgurl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-white/70" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium">{loggedInUser.user_name || 'ผู้ใช้'}</p>
                    <p className="text-white/60 text-sm">{loggedInUser.user_email}</p>
                  </div>
                </div>
              )}

              <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
                หน้าแรก
              </MobileNavLink>
              <MobileNavLink to="/product" onClick={() => setIsMenuOpen(false)}>
                สินค้า
              </MobileNavLink>
              
              {loggedInUser ? (
                <>
                  <MobileNavLink to="/cart" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ShoppingCart className="w-5 h-5" />
                        <span>ตะกร้า</span>
                      </div>
                      {loggedInUser.cart?.itemCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {loggedInUser.cart.itemCount}
                        </span>
                      )}
                    </div>
                  </MobileNavLink>
                  
                  <div className="h-px bg-white/10 my-3" />
                  
                  <MobileNavLink to="/manage-profile" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5" />
                      <span>จัดการโปรไฟล์</span>
                    </div>
                  </MobileNavLink>
                  <MobileNavLink to="/manage-rentals" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5" />
                      <span>จัดการการให้เช่า</span>
                    </div>
                  </MobileNavLink>
                  <MobileNavLink to="/track-rental" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5" />
                      <span>ติดตามสถานะการเช่า</span>
                    </div>
                  </MobileNavLink>
                  
                  <div className="h-px bg-white/10 my-3" />
                  
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full text-center bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </div>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-white/70 hover:text-white transition duration-200"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition duration-200"
    onClick={onClick}
  >
    {children}
  </Link>
);

const CartButton = ({ itemCount = 0 }) => (
  <Link
    to="/cart"
    className="relative group"
  >
    <div className="p-2 rounded-lg hover:bg-white/10 transition duration-200">
      <ShoppingCart className="w-5 h-5 text-white/70 group-hover:text-white" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {itemCount}
        </span>
      )}
    </div>
  </Link>
);

const UserMenu = ({ loggedInUser, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {loggedInUser.user_imgurl ? (
          <img
            src={loggedInUser.user_imgurl}
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-white/20"
          />
        ) : (
          <User className="w-5 h-5 text-white/70" />
        )}
        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
          <MenuLink to="/manage-profile" icon={User}>
            จัดการโปรไฟล์
          </MenuLink>
          <MenuLink to="/manage-rentals" icon={Package}>
            จัดการการให้เช่า
          </MenuLink>
          <MenuLink to="/track-rental" icon={Settings}>
            ติดตามสถานะการเช่า
          </MenuLink>
          <button
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      )}
    </div>
  );
};

const MenuLink = ({ to, icon: Icon, children }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </Link>
);

export default Nav;