"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { Shield, Users, Package, BarChart3 } from "lucide-react";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-12 h-12 text-red-500" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent">
                Administration
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Gestion de la plateforme Sketch Design Maroc
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <Users className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Utilisateurs</h3>
              <p className="text-gray-400 text-sm">Gérer les utilisateurs et leurs rôles</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <Package className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Produits</h3>
              <p className="text-gray-400 text-sm">Gérer le catalogue de produits</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <BarChart3 className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
              <p className="text-gray-400 text-sm">Statistiques et rapports</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <Shield className="w-8 h-8 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Sécurité</h3>
              <p className="text-gray-400 text-sm">Paramètres de sécurité</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm">
              Interface d'administration - Fonctionnalités à développer
            </p>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
