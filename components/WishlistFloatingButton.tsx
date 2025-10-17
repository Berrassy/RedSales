"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/hooks/useWishlist";

export default function WishlistFloatingButton() {
  const { wishlistCount } = useWishlist();

  return (
    <Link href="/wishlist">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#E50914] to-[#c40812] text-white p-4 shadow-2xl hover:shadow-[#E50914]/50 transition-all duration-300 cursor-pointer group"
      >
        <Heart className="w-6 h-6 fill-white group-hover:animate-pulse" />
        
        {/* Badge Count */}
        <AnimatePresence>
          {wishlistCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-xs font-bold w-6 h-6 flex items-center justify-center shadow-lg"
            >
              {wishlistCount > 9 ? "9+" : wishlistCount}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Ma Wishlist
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/90" />
        </div>
      </motion.div>
    </Link>
  );
}

