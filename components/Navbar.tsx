"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { name: "PACKS PROMO", href: "#" },
    {
      name: "SALONS",
      sub: [
        { name: "Salons d'angle", href: "#" },
        { name: "Salons en U", href: "#" },
      ],
    },
    {
      name: "CANAPÉS",
      sub: [
        { name: "Canapés", href: "#" },
        { name: "Fauteuils", href: "#" },
        { name: "Pouf", href: "#" },
        { name: "Bench", href: "#" },
      ],
    },
    {
      name: "CHAMBRE",
      sub: [
        { name: "Lits", href: "#" },
        { name: "Matelas", href: "#" },
        { name: "Commodes", href: "#" },
        { name: "Tables de chevet", href: "#" },
      ],
    },
    {
      name: "TABLES",
      sub: [
        { name: "Tables basses", href: "#" },
        { name: "Tables de salle à manger", href: "#" },
        { name: "Tables d'appoint", href: "#" },
      ],
    },
    { name: "CHAISES", href: "#" },
    {
      name: "JARDIN",
      sub: [
        { name: "Ensemble extérieur", href: "#" },
        { name: "Tables d'extérieur", href: "#" },
        { name: "Parasols & Transats", href: "#" },
        { name: "Chaises d'extérieur", href: "#" },
      ],
    },
    {
      name: "MEUBLES",
      sub: [
        { name: "Consoles", href: "#" },
        { name: "Armoires", href: "#" },
        { name: "Bibliothèques", href: "#" },
        { name: "Buffets", href: "#" },
        { name: "Meubles TV", href: "#" },
      ],
    },
    { name: "DÉCO", sub: [{ name: "Miroirs", href: "#" }] },
  ];

  return (
    <nav className="w-full bg-[#1F1F1F] text-white border-b border-[#2A2A2A] relative z-50">
      {/* Top section */}
      <div className="flex items-center justify-between px-8 py-4">
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

        {/* Search bar */}
        <div className="hidden md:flex items-center w-1/3 relative">
          <Search className="absolute left-3 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 bg-[#2A2A2A] border-none text-sm text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0E3B2C] focus-visible:ring-[#0E3B2C] transition-all"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <User className="w-5 h-5 hover:text-[#0E3B2C] cursor-pointer transition-colors duration-200" />
          <Heart className="w-5 h-5 hover:text-[#0E3B2C] cursor-pointer transition-colors duration-200" />
          <ShoppingCart className="w-5 h-5 hover:text-[#0E3B2C] cursor-pointer transition-colors duration-200" />

          {/* Mobile menu trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Menu className="md:hidden w-6 h-6 hover:text-[#0E3B2C] cursor-pointer transition-colors duration-200" />
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#1F1F1F] border-[#2A2A2A] w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-white flex items-center justify-start">
                  <Image
                    src="/images/sketchlogo.svg"
                    alt="Sketch Design"
                    width={150}
                    height={50}
                    className="h-auto w-auto max-h-[50px]"
                  />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                {/* Mobile Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 bg-[#2A2A2A] border-none text-sm text-white placeholder:text-gray-400"
                  />
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-4">
                  {categories.map((cat) => (
                    <div key={cat.name} className="border-b border-[#2A2A2A] pb-3">
                      <Link
                        href={cat.href || "#"}
                        className="uppercase tracking-wide text-sm font-medium hover:text-[#0E3B2C] transition-colors block mb-2"
                        onClick={() => !cat.sub && setIsOpen(false)}
                      >
                        {cat.name}
                      </Link>
                      {cat.sub && (
                        <ul className="ml-4 mt-2 flex flex-col gap-2">
                          {cat.sub.map((sub) => (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                className="text-[#C4C4C4] hover:text-white text-sm transition-colors block"
                                onClick={() => setIsOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Navigation Menu - Desktop only */}
      <div className="hidden md:flex justify-center border-t border-[#2A2A2A] py-2">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-2">
            {categories.map((cat) => (
              <NavigationMenuItem key={cat.name} className="relative">
                {cat.sub ? (
                  <>
                    <NavigationMenuTrigger className="bg-transparent hover:text-[#0E3B2C] data-[state=open]:text-[#0E3B2C] uppercase tracking-wide text-sm font-medium transition-colors duration-200">
                      {cat.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-md shadow-xl mt-2">
                      <ul className="grid gap-3 min-w-[220px]">
                        {cat.sub.map((sub) => (
                          <li key={sub.name}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={sub.href}
                                className="block text-[#C4C4C4] hover:text-white text-sm transition-colors duration-200 py-1"
                              >
                                {sub.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={cat.href || "#"}
                      className="inline-flex h-10 w-max items-center justify-center px-4 py-2 uppercase tracking-wide text-sm font-medium hover:text-[#0E3B2C] transition-colors duration-200"
                    >
                      {cat.name}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}

