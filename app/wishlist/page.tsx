"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import WishlistToast from "@/components/WishlistToast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, Eye, MessageCircle, Sparkles } from "lucide-react";
import { getWishlist, removeFromWishlist, generateViewCount, WishlistItem } from "@/lib/wishlist";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      loadWishlist();
    };
    
    window.addEventListener("wishlistUpdate", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdate", handleWishlistUpdate);
  }, []);

  const loadWishlist = () => {
    setIsLoading(true);
    const items = getWishlist();
    setWishlistItems(items);
    
    // Generate random view counts for each product
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.id] = generateViewCount();
    });
    setViewCounts(counts);
    
    setIsLoading(false);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getWhatsAppLink = (productName: string) => {
    const { WHATSAPP_CONFIG } = require("@/lib/config");
    const message = encodeURIComponent(`Bonjour, je veux commander le produit ${productName}`);
    return `https://wa.me/${WHATSAPP_CONFIG.PHONE_NUMBER}?text=${message}`;
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]">
        <Navbar />
        <WishlistToast />
      
      {/* Add padding to account for fixed navbar */}
      <div className="pt-32 pb-16">
        {/* Hero Section - Title with Animation */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container mx-auto px-4 mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-[#E50914] fill-[#E50914]" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#E50914] via-[#FFD700] to-[#E50914] bg-clip-text text-transparent">
              Ma Wishlist
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Sparkles className="w-10 h-10 text-[#FFD700]" />
            </motion.div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto"
          >
            Vos produits préférés, à portée de clic
          </motion.p>

          {/* Wishlist Count */}
          {!isLoading && wishlistItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 inline-block"
            >
              <div className="px-6 py-3 bg-gradient-to-r from-[#E50914]/20 to-[#FFD700]/20 border border-[#E50914]/30 backdrop-blur-sm">
                <span className="text-gray-300">
                  {wishlistItems.length} produit{wishlistItems.length > 1 ? "s" : ""} en wishlist
                </span>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Back to Shopping Button */}
        {wishlistItems.length > 0 && (
          <div className="container mx-auto px-4 mb-8">
            <motion.a
              href="/"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <span className="text-2xl">←</span>
              <span>Continuer vos achats</span>
            </motion.a>
          </div>
        )}

        {/* Wishlist Grid */}
        <section className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-[#E50914] border-t-transparent"
              />
            </div>
          ) : wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-24 h-24 text-gray-700 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-400 mb-4">
                Votre wishlist est vide
              </h2>
              <p className="text-gray-500 mb-8">
                Ajoutez vos produits préférés pour les retrouver facilement
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#E50914] to-[#c40812] text-white font-bold hover:shadow-lg hover:shadow-[#E50914]/50 transition-all duration-300 transform hover:scale-105"
              >
                Découvrir les produits
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {wishlistItems.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group relative bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-md overflow-hidden border border-gray-800/50 hover:border-[#E50914]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#E50914]/20"
                  >
                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-sm p-2.5 text-white hover:bg-[#E50914] hover:text-white transition-all duration-300 shadow-lg"
                      title="Retirer de la wishlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#E50914] to-[#c40812] text-white px-4 py-2 text-sm font-bold shadow-lg">
                      -{product.discountPercentage}%
                    </div>

                    {/* Product Image */}
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Product Details */}
                    <div className="p-6 space-y-4">
                      {/* Category */}
                      <span className="inline-block px-3 py-1 bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                        {product.category}
                      </span>

                      {/* Product Name */}
                      <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-[#FFD700] transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {product.description}
                      </p>

                      {/* Pricing Section */}
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent animate-pulse">
                            {formatPrice(product.discountedPrice)}
                          </span>
                          <span className="text-lg text-gray-600 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Économisez{" "}
                          <span className="text-[#FFD700] font-semibold">
                            {formatPrice(product.originalPrice - product.discountedPrice)}
                          </span>
                        </div>
                      </div>

                      {/* View Count */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>
                          👁️ {viewCounts[product.id] || generateViewCount()} personnes ont vu ce produit aujourd&apos;hui
                        </span>
                      </div>

                      {/* WhatsApp Button */}
                      <motion.a
                        href={getWhatsAppLink(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-green-600/50 group/btn"
                      >
                        <MessageCircle className="w-5 h-5 group-hover/btn:animate-bounce" />
                        <span>Commander via WhatsApp</span>
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
      </main>
    </ProtectedRoute>
  );
}

