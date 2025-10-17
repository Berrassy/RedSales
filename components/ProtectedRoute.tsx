"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "CLIENT" | "ADMIN";
  fallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = "CLIENT",
  fallback 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      // Not authenticated, redirect to sign in
      router.push("/auth/signin");
      return;
    }

    if (requiredRole === "ADMIN" && session.user?.role !== "ADMIN") {
      // Not admin, redirect to home
      router.push("/");
      return;
    }
  }, [session, status, router, requiredRole]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Accès non autorisé</h1>
          <p className="text-gray-400 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Check role for admin routes
  if (requiredRole === "ADMIN" && session.user?.role !== "ADMIN") {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Accès refusé</h1>
          <p className="text-gray-400 mb-6">Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
}
