import React, { useState, useEffect } from "react";
import Nav from "./nav";
import Footer from "./Footer"; // Import Footer component
import Login from "./login"; // Import Login component
import SignUp from "./SignUp"; // Import SignUp component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage"; // Import HomePage component
import ManageProfile from "./ManageProfile"; // Import ManageProfile component
import AllProducts from "./AllProducts"; // AllProducts Page Component
import ProductDetail from "./ProductDetail";
import Cart from "./cart"; // Import Cart component
import ManageRentals from "./ManageRentals"; // Import ManageRentals component


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Check if the user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      {/* App Container */}
      <div className="flex flex-col min-h-screen bg-gray-900 relative">
        {/* Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-to-black-start to-pink-to-black-end rounded-b-[20rem] z-[-1]"></div>

        {/* Header (Nav) */}
        <Nav loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

        {/* Main Content (Body) */}
        <main className="flex-grow">
          <Routes>
            {/* Route for login */}
            <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />

            {/* Route for sign-up */}
            <Route path="/signup" element={<SignUp />} />

            {/* Route for Manage Profile */}
            <Route path="/manage-profile" element={<ManageProfile />} />

            <Route path="/product" element={<AllProducts />} /> {/* All Products Page */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/all-products" element={<AllProducts />} /> {/* All Products Page */}
            <Route path="/cart" element={<Cart />} /> {/* Cart Page */}
            <Route path="/manage-rentals" element={<ManageRentals />} />

            {/* Default route for Home */}
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>

        {/* Footer Section */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
