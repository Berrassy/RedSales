"use client";

import { useState, useEffect } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  getWishlistCount,
  WishlistItem,
} from "@/lib/wishlist";
import { Product } from "@/lib/products";

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  const loadWishlist = () => {
    setWishlistItems(getWishlist());
    setWishlistCount(getWishlistCount());
  };

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener("wishlistUpdate", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdate", handleWishlistUpdate);
  }, []);

  const addItem = (product: Product) => {
    const success = addToWishlist(product);
    return success;
  };

  const removeItem = (productId: string) => {
    const success = removeFromWishlist(productId);
    return success;
  };

  const isItemInWishlist = (productId: string) => {
    return isInWishlist(productId);
  };

  return {
    wishlistItems,
    wishlistCount,
    addItem,
    removeItem,
    isItemInWishlist,
  };
}

