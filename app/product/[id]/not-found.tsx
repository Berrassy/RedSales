import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Produit non trouvé</h2>
          <p className="text-gray-300 text-lg mb-8">
            Le produit que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Voir tous les produits
          </Link>
        </div>
      </div>
    </main>
  );
}
