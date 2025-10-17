"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Truck, 
  Shield,
  Star,
  Clock,
  Zap
} from "lucide-react";
import { Product } from "@/lib/products";

interface ProductDetailsSectionProps {
  product: Product;
}

export default function ProductDetailsSection({ product }: ProductDetailsSectionProps) {
  const [viewCount, setViewCount] = useState(0);
  const [isInStock, setIsInStock] = useState(product.stock > 0);

  // Generate random view count on component mount
  useEffect(() => {
    setViewCount(Math.floor(Math.random() * (300 - 15 + 1)) + 15);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { 
      text: "Rupture de stock", 
      color: "text-red-500", 
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      icon: AlertTriangle 
    };
    if (stock <= 3) return { 
      text: `${stock} restant${stock > 1 ? "s" : ""}`, 
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      icon: AlertTriangle
    };
    return { 
      text: "En stock", 
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      icon: CheckCircle
    };
  };

  const stockStatus = getStockStatus(product.stock);
  const StockIcon = stockStatus.icon;

  return (
    <div className="space-y-6">
      {/* Product Title & View Count */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
          {product.name}
        </h1>
        
        {/* View Count with Fire Icon */}
        <div className="flex items-center gap-2 text-gray-300">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">
              🔥 {viewCount} personnes ont vu ce produit aujourd'hui
            </span>
          </div>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
        <p className="text-gray-300 leading-relaxed">
          {product.description}
        </p>
        
        {/* Dimensions */}
        {product.dimensions && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-sm font-medium">Dimensions:</span>
              <span className="text-sm">{product.dimensions}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Price Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-r from-red-900/20 to-yellow-900/20 p-6 rounded-xl border border-red-500/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-red-500">
              {formatPrice(product.discountedPrice)}
            </span>
            <span className="text-xl text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-semibold text-lg">
              Économisez {formatPrice(product.originalPrice - product.discountedPrice)}
            </div>
            <div className="text-yellow-400 text-sm">
              -{product.discountPercentage}% de réduction
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stock Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`p-4 rounded-xl border ${stockStatus.bgColor} ${stockStatus.borderColor}`}
      >
        <div className="flex items-center gap-3">
          <StockIcon className={`w-6 h-6 ${stockStatus.color}`} />
          <div>
            <span className={`font-semibold text-lg ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
            {product.stock <= 3 && product.stock > 0 && (
              <span className="ml-2 text-xs text-orange-600 font-medium animate-pulse">
                LIMITÉ
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Availability by City */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          Disponibilité par ville
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {product.availableCities.map((city, index) => (
            <div 
              key={city}
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">{city}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Features & Benefits */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center">
          <Truck className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h4 className="font-semibold text-white mb-1">Livraison rapide</h4>
          <p className="text-sm text-gray-300">Livraison sous 24-48h</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center">
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <h4 className="font-semibold text-white mb-1">Garantie</h4>
          <p className="text-sm text-gray-300">Garantie 2 ans incluse</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center">
          <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <h4 className="font-semibold text-white mb-1">Support 24/7</h4>
          <p className="text-sm text-gray-300">Assistance disponible</p>
        </div>
      </motion.div>

      {/* Limited Offer Banner */}
      {product.stock <= 3 && product.stock > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-4 text-lg font-bold rounded-xl animate-pulse shadow-2xl">
            ⚡ OFFRE LIMITÉE - Plus que {product.stock} disponible{product.stock > 1 ? 's' : ''}
          </div>
        </motion.div>
      )}
    </div>
  );
}
