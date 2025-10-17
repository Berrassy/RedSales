"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Trash2, MessageCircle, Eye } from "lucide-react";
import { Product } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist-context";

interface WishlistCardProps {
  product: Product;
  index: number;
}

export default function WishlistCard({ product, index }: WishlistCardProps) {
  const { removeFromWishlist } = useWishlist();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppOrder = () => {
    const message = `Bonjour, je suis intéressé par ce produit: ${product.name} - ${formatPrice(product.discountedPrice)}`;
    const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(product.id);
  };

  // Generate random viewer count
  const viewerCount = Math.floor(Math.random() * 76) + 5; // 5-80 range

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
    >
      {/* Discount Badge */}
      <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
        -{product.discountPercentage}%
      </div>

      {/* Remove from Wishlist Button */}
      <button
        onClick={handleRemoveFromWishlist}
        className="absolute top-3 left-3 z-20 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
        title="Retirer de la wishlist"
      >
        <Trash2 className="w-4 h-4" />
      </button>

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
              className="bg-white text-black p-2 rounded-full hover:bg-yellow-400 transition-colors duration-200 shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button 
              onClick={handleWhatsAppOrder}
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-200 shadow-lg"
              title="Commander par WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
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
            Stock: <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? 'En stock' : 'Rupture de stock'}
            </span>
          </div>
        </div>

        {/* Viewer Count */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{viewerCount} personnes ont ajouté ce produit aujourd'hui</span>
          </div>
        </div>

        {/* WhatsApp Order Button */}
        <button 
          onClick={handleWhatsAppOrder}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            product.stock === 0 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:scale-105"
          }`}
          disabled={product.stock === 0}
        >
          <MessageCircle className="w-4 h-4" />
          {product.stock === 0 ? "Rupture de stock" : "Commander par WhatsApp"}
        </button>
      </div>
    </motion.div>
  );
}
