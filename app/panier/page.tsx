"use client";

import React from "react";
import { useCart } from "@/lib/hooks/useCart";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-12 max-w-md mx-auto">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-4">Votre panier est vide</h1>
              <p className="text-gray-300 mb-8">
                Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300"
              >
                Continuer mes achats
              </Link>
            </div>
          </motion.div>
        </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8" />
              Mon Panier ({cartCount} articles)
            </h1>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 p-4 bg-white/5 border border-white/10"
                >
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{item.category}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-red-400 font-bold text-lg">
                        {item.discountedPrice.toFixed(2)} MAD
                      </span>
                      {item.originalPrice && item.originalPrice > item.discountedPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {item.originalPrice.toFixed(2)} MAD
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        size="sm"
                        className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-white font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        size="sm"
                        className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={() => removeItem(item.id)}
                      size="sm"
                      className="w-8 h-8 p-0 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-white">Total:</span>
                <span className="text-2xl font-bold text-red-400">
                  {cartTotal.total.toFixed(2)} MAD
                </span>
              </div>
              
              <div className="flex gap-4">
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 text-center border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                >
                  Continuer mes achats
                </Link>
                <Button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3">
                  Passer la commande
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </ProtectedRoute>
  );
}