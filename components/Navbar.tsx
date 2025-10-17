"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Zap, ShoppingCart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/hooks/useCart";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    const handleCloseMobileMenu = () => {
      setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('closeMobileMenu', handleCloseMobileMenu);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('closeMobileMenu', handleCloseMobileMenu);
    };
  }, []);

  const categories = [
    { name: "SALONS", href: "#" },
    { name: "CANAPÉS", href: "#" },
    { name: "CHAMBRE", href: "#" },
    { name: "TABLES", href: "#" },
    { name: "CHAISES", href: "#" },
    { name: "JARDIN", href: "#" },
    { name: "MEUBLES", href: "#" },
    { name: "DÉCO", href: "#" },
  ];

  // Handle protected route clicks
  const handleProtectedClick = (route: string, e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      router.push("/auth/signin");
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white border-b border-red-500/20 fixed top-0 left-0 right-0 z-50">
      {/* Black Friday Banner with Animation */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-gradient-to-r from-red-600 to-red-700 py-2 text-center overflow-hidden"
          >
            <div className="flex items-center justify-center gap-2 text-sm font-bold animate-pulse">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">BLACK FRIDAY</span>
              <span className="text-white">- JUSQU&apos;À -50%</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/images/sketchlogo.svg"
              alt="Sketch Design"
              width={180}
              height={60}
              priority
              style={{ width: "auto", height: "auto" }}
              className="max-h-[60px]"
            />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="relative px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:text-red-400 hover:bg-red-500/10 group"
                >
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Cart Icon */}
            <Link
              href="/panier"
              onClick={(e) => handleProtectedClick("/panier", e)}
              className="relative p-2 text-white hover:text-yellow-400 transition-colors duration-200 hover:bg-yellow-500/10"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication */}
            {session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/10">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{session.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-white hover:text-red-400 transition-colors duration-200 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-semibold text-white hover:text-red-400 transition-colors duration-200 hover:bg-red-500/10"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Icons & Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Cart Icon Mobile */}
            <Link
              href="/panier"
              onClick={(e) => handleProtectedClick("/panier", e)}
              className="relative p-2 text-white hover:text-yellow-400 transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold w-4 h-4 flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:text-red-400 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:text-red-400 hover:bg-red-500/10 text-center border border-gray-700 hover:border-red-500/50"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile Authentication */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/10">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{session.user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white hover:text-red-400 transition-colors duration-200 hover:bg-red-500/10"
                  >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-sm font-semibold text-white hover:text-red-400 transition-colors duration-200 hover:bg-red-500/10 text-center border border-gray-700 hover:border-red-500/50"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-sm font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-center transition-all duration-300"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}