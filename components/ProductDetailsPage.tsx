"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { blackFridayProducts } from "@/lib/products";
import { 
  ShoppingCart, 
  Heart, 
  Eye, 
  Star, 
  CheckCircle, 
  AlertTriangle,
  Users,
  ArrowLeft,
  Share2
} from "lucide-react";
import Link from "next/link";

interface ProductDetailsPageProps {
  product: Product;
}

export default function ProductDetailsPage({ product }: ProductDetailsPageProps) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [viewCount, setViewCount] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

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
      icon: AlertTriangle 
    };
    if (stock <= 3) return { 
      text: `${stock} restant${stock > 1 ? "s" : ""}`, 
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      icon: AlertTriangle
    };
    return { 
      text: "En stock", 
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      icon: CheckCircle
    };
  };

  const generateWhatsAppLink = (productName: string) => {
    const message = `Bonjour je veux commander le produit ${productName}`;
    return `https://wa.me/212XXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const stockStatus = getStockStatus(product.stock);
  const StockIcon = stockStatus.icon;

  // Get related products (same category, excluding current product)
  const relatedProducts = blackFridayProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux produits
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className={`relative aspect-square rounded-xl overflow-hidden bg-white group cursor-pointer transition-all duration-300 ${
                isImageZoomed ? 'scale-105' : 'hover:scale-105'
              }`}
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            >
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Zoom indicator */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Eye className="w-3 h-3 inline mr-1" />
                Cliquez pour zoomer
              </div>

              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                -{product.discountPercentage}%
              </div>

              {/* Featured Banner */}
              {product.isFeatured && (
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ⭐ FEATURED
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {[product.image, product.image, product.image, product.image].map((img, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    selectedImage === img 
                      ? 'ring-2 ring-yellow-400 scale-105' 
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Product Title */}
            <div className="animate-fade-in">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {product.name}
              </h1>
              
              {/* View Count */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Users className="w-4 h-4" />
                <span>{viewCount} personnes ont vu ce produit aujourd'hui</span>
              </div>
            </div>

            {/* Description */}
            <div className="animate-fade-in-delay-1">
              <p className="text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="animate-fade-in-delay-2">
              <div className="bg-gradient-to-r from-red-900/20 to-yellow-900/20 p-6 rounded-xl border border-red-500/20">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-red-500">
                    {formatPrice(product.discountedPrice)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
                <div className="text-green-400 font-semibold">
                  Économisez {formatPrice(product.originalPrice - product.discountedPrice)}
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="animate-fade-in-delay-3">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${stockStatus.bgColor} border border-current`}>
                <StockIcon className={`w-5 h-5 ${stockStatus.color}`} />
                <span className={`font-semibold ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
                {product.stock <= 3 && product.stock > 0 && (
                  <span className="text-xs text-orange-600 font-medium animate-pulse">
                    LIMITÉ
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 animate-fade-in-delay-4">
              {/* WhatsApp Order Button */}
              <a
                href={generateWhatsAppLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Commander par WhatsApp
              </a>

              {/* Secondary Actions */}
              <div className="flex gap-3">
                <button 
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    product.stock === 0 
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-lg transform hover:scale-105"
                  }`}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5 inline mr-2" />
                  {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
                </button>
                
                <button className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
                  <Heart className="w-5 h-5" />
                </button>
                
                <button className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Limited Offer Tag */}
            {product.stock <= 3 && product.stock > 0 && (
              <div className="animate-fade-in-delay-5">
                <div className="text-center">
                  <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                    ⚡ OFFRE LIMITÉE - Plus que {product.stock} disponible{product.stock > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 animate-fade-in-delay-6">
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Produits similaires</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-400 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
