import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCartItems);
    calculateTotalPrice(savedCartItems);
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = (id, quantity) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    calculateTotalPrice(updatedItems);
  };

  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    calculateTotalPrice(updatedItems);
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
    setTotalPrice(0);
  };

  return (
    <div className="cart-container p-6">
      <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/product" className="text-blue-500">Start shopping</Link>.</p>
      ) : (
        <div>
          <div className="cart-items mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item flex items-center justify-between py-3 border-b border-gray-300">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover mr-4" />
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-500">Price: ${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    className="w-12 text-center border border-gray-300 rounded-md"
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  />
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="total-price flex justify-between py-3 border-t border-gray-300">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>

          <div className="actions flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
            <Link
              to="/checkout"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
