import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page non trouvée</h2>
        <p className="text-gray-300 mb-8">La page que vous recherchez n'existe pas.</p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/"
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </div>
    </div>
  )
}
