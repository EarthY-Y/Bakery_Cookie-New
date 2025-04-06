import React, { createContext, useState, useContext, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // ใช้ useMemo เพื่อคำนวณ totalPrice เมื่อ cartItems เปลี่ยนแปลง
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, cartItem) => sum + cartItem.selling_price_per_quantity * cartItem.quantity,
      0
    );
  }, [cartItems]); // คำนวณใหม่เมื่อ cartItems เปลี่ยนแปลงเท่านั้น

  const addToCart = (item, quantity) => {
    const updatedCart = [...cartItems, { ...item, quantity }];
    setCartItems(updatedCart);
    console.log(item, quantity);
  };

  return (
    <CartContext.Provider value={{ cartItems, totalPrice, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
