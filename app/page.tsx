import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { blackFridayProducts } from "@/lib/products";
import { Clock, Zap, Gift, Star } from "lucide-react";

export default function Home() {
  const featuredProducts = blackFridayProducts.filter(p => p.isFeatured);
  const almostSoldOutProducts = blackFridayProducts.filter(p => p.isAlmostSoldOut);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-black to-yellow-900/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-bold text-lg animate-bounce">BLACK FRIDAY</span>
            <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-yellow-400 to-red-600 bg-clip-text text-transparent animate-pulse">
            SOLDES EXCEPTIONNELS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Jusqu'à <span className="text-red-500 font-bold text-3xl">-50%</span> sur toute la collection
          </p>
          <div className="flex items-center justify-center gap-4 text-yellow-400 mb-8">
            <Clock className="w-6 h-6 animate-spin" />
            <span className="text-lg font-semibold">Offre limitée dans le temps</span>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-red-900/10 to-yellow-900/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">Produits Vedettes</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-400 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Almost Sold Out Section */}
      {almostSoldOutProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-orange-900/10 to-red-900/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Gift className="w-8 h-8 text-orange-400" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">Presque Épuisés</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-400 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {almostSoldOutProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-red-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Tous les Produits</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-red-400 to-transparent"></div>
          </div>
          
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blackFridayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ne Ratez Pas Cette Opportunité !
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Des réductions exceptionnelles sur tous nos meubles marocains de luxe. 
            Quantités limitées !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Voir Tous les Produits
            </button>
            <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Contactez-Nous
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

