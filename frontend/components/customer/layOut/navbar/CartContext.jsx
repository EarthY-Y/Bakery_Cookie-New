import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  let [totalPrice, setTotalPrice] = useState(0);

  const addToCart = (item, quantity) => {
    const updatedCart = [...cartItems, { ...item, quantity }];
    setCartItems(updatedCart);
    console.log(item, quantity);
    const updatedTotal = updatedCart.reduce(
      (sum, cartItem) => sum + cartItem.selling_price_per_quantity * cartItem.quantity,
      0
    );
    setTotalPrice(updatedTotal);
  };

  return (
    <CartContext.Provider value={{ cartItems, totalPrice, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);