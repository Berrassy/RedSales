"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <nav className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white border-b border-red-500/20 relative z-50">
      {/* Black Friday Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-2 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-bold animate-pulse">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400">BLACK FRIDAY</span>
          <span className="text-white">- JUSQU'À -50%</span>
          <Zap className="w-4 h-4 text-yellow-400" />
        </div>
      </div>

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
              className="h-auto w-auto max-h-[60px]"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="relative px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg group"
              >
                {category.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:text-red-400 transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-center border border-gray-700 hover:border-red-500/50"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

