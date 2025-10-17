"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useCart } from "@/lib/hooks/useCart";
import Toast from "./Toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, removeItem, isItemInWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setIsInWishlist(isItemInWishlist(product.id));
  }, [product.id, isItemInWishlist]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product, 1);
    setShowToast(true);
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <>
      <Toast
        message="✅ Produit ajouté au panier!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <div className="group relative bg-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2">
      {/* Featured Banner */}
      {product.isFeatured && (
        <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 text-xs font-bold shadow-lg animate-pulse">
          ⭐ FEATURED
        </div>
      )}

      {/* Almost Sold Out Banner */}
      {product.isAlmostSoldOut && !product.isFeatured && (
        <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 text-xs font-bold shadow-lg animate-bounce">
          🔥 PRESQUE ÉPUISÉ
        </div>
      )}

      {/* Discount Badge */}
      <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 text-sm font-bold shadow-lg">
        -{product.discountPercentage}%
      </div>

      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Image Overlay on Hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <Link 
              href={`/product/${product.id}`}
              className="bg-white text-black p-2 hover:bg-yellow-400 transition-colors duration-200 shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button 
              onClick={handleWishlistToggle}
              className={`p-2 transition-colors duration-200 shadow-lg ${
                isInWishlist 
                  ? "bg-red-500 text-white" 
                  : "bg-white text-black hover:bg-red-500 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? "fill-white" : ""}`} />
            </button>
            <button 
              onClick={handleAddToCart}
              className="bg-white text-black p-2 hover:bg-green-500 hover:text-white transition-colors duration-200 shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(product.discountedPrice)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Économisez {formatPrice(product.originalPrice - product.discountedPrice)}
          </div>
        </div>

        {/* Stock Information */}
        <div className="mb-3">
          <div className="text-sm text-gray-600">
            Stock: <span className="font-semibold text-gray-900">{product.stock}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className={`w-full py-2 px-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            product.stock === 0 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg transform hover:scale-105"
          } ${isAdding ? "scale-95" : ""}`}
          disabled={product.stock === 0}
        >
          <ShoppingCart className={`w-4 h-4 ${isAdding ? "animate-bounce" : ""}`} />
          {product.stock === 0 ? "Rupture de stock" : isAdding ? "Ajouté!" : "Ajouter au panier"}
        </button>

      </div>
    </div>
    </>
  );
}
