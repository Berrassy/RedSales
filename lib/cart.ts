"use client";

import { Product } from "./products";
import { WHATSAPP_CONFIG } from "./config";

const CART_KEY = "blackfriday_cart";

export interface CartItem extends Product {
  quantity: number;
  addedAt: string;
}

// Get cart from localStorage
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
}

// Add product to cart
export function addToCart(product: Product, quantity: number = 1): boolean {
  try {
    const cart = getCart();
    
    // Check if product already exists
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        ...product,
        quantity,
        addedAt: new Date().toISOString(),
      };
      cart.push(newItem);
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    
    // Dispatch custom event for reactivity
    window.dispatchEvent(new Event("cartUpdate"));
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return false;
  }
}

// Update item quantity
export function updateCartItemQuantity(productId: string, quantity: number): boolean {
  try {
    const cart = getCart();
    const itemIndex = cart.findIndex((item) => item.id === productId);
    
    if (itemIndex === -1) return false;
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      return removeFromCart(productId);
    }
    
    cart[itemIndex].quantity = quantity;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    
    // Dispatch custom event for reactivity
    window.dispatchEvent(new Event("cartUpdate"));
    return true;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return false;
  }
}

// Remove product from cart
export function removeFromCart(productId: string): boolean {
  try {
    const cart = getCart();
    const updatedCart = cart.filter((item) => item.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    
    // Dispatch custom event for reactivity
    window.dispatchEvent(new Event("cartUpdate"));
    return true;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
}

// Check if product is in cart
export function isInCart(productId: string): boolean {
  const cart = getCart();
  return cart.some((item) => item.id === productId);
}

// Clear entire cart
export function clearCart(): void {
  try {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event("cartUpdate"));
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
}

// Get cart count (total items)
export function getCartCount(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get cart total price
export function getCartTotal(): { subtotal: number; discount: number; total: number } {
  const cart = getCart();
  
  const subtotal = cart.reduce((total, item) => {
    return total + (item.originalPrice * item.quantity);
  }, 0);
  
  const total = cart.reduce((sum, item) => {
    return sum + (item.discountedPrice * item.quantity);
  }, 0);
  
  const discount = subtotal - total;
  
  return { subtotal, discount, total };
}

// Generate random "X people added this today" count (10-100)
export function generateAddedTodayCount(): number {
  return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}

// Generate WhatsApp message with cart items
export function generateWhatsAppMessage(cart: CartItem[], total: number): string {
  const phoneNumber = WHATSAPP_CONFIG.PHONE_NUMBER;
  
  let message = "Bonjour! Je veux commander les produits suivants:%0A%0A";
  
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}%0A`;
    message += `   Quantité: ${item.quantity}%0A`;
    message += `   Prix: ${item.discountedPrice} MAD%0A%0A`;
  });
  
  message += `%0ATotal: ${total.toFixed(2)} MAD`;
  
  return `https://wa.me/${phoneNumber}?text=${message}`;
}

