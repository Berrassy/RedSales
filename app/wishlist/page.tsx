"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import WishlistCard from "@/components/WishlistCard";
import Navbar from "@/components/Navbar";

export default function WishlistPage() {
  const { wishlist, clearWishlist, wishlistCount } = useWishlist();

  const handleWhatsAppOrderAll = () => {
    const productNames = wishlist.map(product => product.name).join(', ');
    const totalPrice = wishlist.reduce((sum, product) => sum + product.discountedPrice, 0);
    const message = `Bonjour, je suis intéressé par ces produits de ma wishlist: ${productNames} - Total: ${new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(totalPrice)}`;
    const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-red-500 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Ma Wishlist ❤️
              </h1>
            </div>
            <p className="text-gray-300 text-lg mb-2">
              Produits que vous avez aimés
            </p>
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-semibold">
              <ShoppingBag className="w-4 h-4" />
              {wishlistCount} {wishlistCount === 1 ? 'article' : 'articles'}
            </div>
          </motion.div>

          {/* Back to Products Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux offres
            </Link>
          </motion.div>

          {/* Wishlist Content */}
          <AnimatePresence mode="wait">
            {wishlist.length === 0 ? (
              // Empty State
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="text-8xl mb-6">🖤</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Votre wishlist est vide pour le moment
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Découvrez nos offres Black Friday et ajoutez vos produits favoris à votre wishlist !
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Parcourir les offres
                </Link>
              </motion.div>
            ) : (
              // Wishlist Grid
              <motion.div
                key="wishlist"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Clear All Button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={clearWishlist}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-200 text-sm"
                  >
                    Vider la wishlist
                  </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <AnimatePresence>
                    {wishlist.map((product, index) => (
                      <WishlistCard
                        key={product.id}
                        product={product}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky Footer for Mobile */}
      {wishlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 p-4 md:hidden"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="text-sm text-gray-300">Total</div>
              <div className="font-bold">
                {wishlistCount} {wishlistCount === 1 ? 'article' : 'articles'}
              </div>
            </div>
            <button
              onClick={handleWhatsAppOrderAll}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              Commander tout
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
