import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page not found</h2>
        <p className="text-gray-300 mb-8">The page you are looking for does not exist.</p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/"
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition-colors duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
