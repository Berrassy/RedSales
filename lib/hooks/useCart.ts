"use client";

import { useState, useEffect } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  isInCart,
  getCartCount,
  getCartTotal,
  CartItem,
} from "@/lib/cart";
import { Product } from "@/lib/products";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState({ subtotal: 0, discount: 0, total: 0 });

  const loadCart = () => {
    setCartItems(getCart());
    setCartCount(getCartCount());
    setCartTotal(getCartTotal());
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdate", handleCartUpdate);
    return () => window.removeEventListener("cartUpdate", handleCartUpdate);
  }, []);

  const addItem = (product: Product, quantity: number = 1) => {
    const success = addToCart(product, quantity);
    return success;
  };

  const removeItem = (productId: string) => {
    const success = removeFromCart(productId);
    return success;
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const success = updateCartItemQuantity(productId, quantity);
    return success;
  };

  const isItemInCart = (productId: string) => {
    return isInCart(productId);
  };

  return {
    cartItems,
    cartCount,
    cartTotal,
    addItem,
    removeItem,
    updateQuantity,
    isItemInCart,
  };
}

