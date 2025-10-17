"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Check } from "lucide-react";

interface ToastMessage {
  id: string;
  type: "add" | "remove";
  productName: string;
}

export default function WishlistToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleWishlistAdd = (e: Event) => {
      const customEvent = e as CustomEvent;
      const productName = customEvent.detail?.productName || "Produit";
      
      const newToast: ToastMessage = {
        id: Date.now().toString(),
        type: "add",
        productName,
      };
      
      setToasts((prev) => [...prev, newToast]);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
      }, 3000);
    };

    const handleWishlistRemove = (e: Event) => {
      const customEvent = e as CustomEvent;
      const productName = customEvent.detail?.productName || "Produit";
      
      const newToast: ToastMessage = {
        id: Date.now().toString(),
        type: "remove",
        productName,
      };
      
      setToasts((prev) => [...prev, newToast]);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener("wishlistItemAdded", handleWishlistAdd);
    window.addEventListener("wishlistItemRemoved", handleWishlistRemove);
    
    return () => {
      window.removeEventListener("wishlistItemAdded", handleWishlistAdd);
      window.removeEventListener("wishlistItemRemoved", handleWishlistRemove);
    };
  }, []);

  return (
    <div className="fixed top-24 right-4 z-[60] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`flex items-center gap-3 px-4 py-3 shadow-2xl backdrop-blur-md border ${
              toast.type === "add"
                ? "bg-green-600/90 border-green-500/50"
                : "bg-red-600/90 border-red-500/50"
            } text-white min-w-[300px]`}
          >
            <div className="flex-shrink-0">
              {toast.type === "add" ? (
                <Heart className="w-5 h-5 fill-white" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium">
                {toast.type === "add" ? "Ajouté à la wishlist" : "Retiré de la wishlist"}
              </p>
              <p className="text-xs opacity-90 line-clamp-1">{toast.productName}</p>
            </div>
            
            <Check className="w-4 h-4 flex-shrink-0" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

