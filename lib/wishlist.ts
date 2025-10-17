"use client";

import { Product } from "./products";

const WISHLIST_KEY = "blackfriday_wishlist";

export interface WishlistItem extends Product {
  addedAt: string;
}

// Get wishlist from localStorage
export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const wishlist = localStorage.getItem(WISHLIST_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error("Error reading wishlist:", error);
    return [];
  }
}

// Add product to wishlist
export function addToWishlist(product: Product): boolean {
  try {
    const wishlist = getWishlist();
    
    // Check if product already exists
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) return false;
    
    const newItem: WishlistItem = {
      ...product,
      addedAt: new Date().toISOString(),
    };
    
    const updatedWishlist = [...wishlist, newItem];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
    
    // Dispatch custom events for reactivity
    window.dispatchEvent(new Event("wishlistUpdate"));
    window.dispatchEvent(
      new CustomEvent("wishlistItemAdded", {
        detail: { productName: product.name },
      })
    );
    return true;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return false;
  }
}

// Remove product from wishlist
export function removeFromWishlist(productId: string): boolean {
  try {
    const wishlist = getWishlist();
    const product = wishlist.find((item) => item.id === productId);
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
    
    // Dispatch custom events for reactivity
    window.dispatchEvent(new Event("wishlistUpdate"));
    if (product) {
      window.dispatchEvent(
        new CustomEvent("wishlistItemRemoved", {
          detail: { productName: product.name },
        })
      );
    }
    return true;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return false;
  }
}

// Check if product is in wishlist
export function isInWishlist(productId: string): boolean {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === productId);
}

// Clear entire wishlist
export function clearWishlist(): void {
  try {
    localStorage.removeItem(WISHLIST_KEY);
    window.dispatchEvent(new Event("wishlistUpdate"));
  } catch (error) {
    console.error("Error clearing wishlist:", error);
  }
}

// Get wishlist count
export function getWishlistCount(): number {
  return getWishlist().length;
}

// Generate random view count for products (20-250)
export function generateViewCount(): number {
  return Math.floor(Math.random() * (250 - 20 + 1)) + 20;
}

