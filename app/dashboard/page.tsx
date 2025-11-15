'use client';

import { ProtectedRoute } from '../../clerk-modules/components/auth/ProtectedRoute';
import { AuthButtons } from '../../clerk-modules/components/auth/AuthButtons';
import { useAuth } from '../../clerk-modules/utils/auth-utils';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <AuthButtons />
          </header>
          
          <main className="max-w-6xl mx-auto">
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                ¡Hola, {user?.firstName} {user?.lastName}! 👋
              </h2>
              <p className="text-gray-600 mb-6">
                Bienvenido a tu panel de control.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Información Personal</h3>
                  <p className="text-blue-600 text-sm">
                    <strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}
                  </p>
                  <p className="text-blue-600 text-sm">
                    <strong>Usuario ID:</strong> {user?.id}
                  </p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Estado de Cuenta</h3>
                  <p className="text-green-600 text-sm">✓ Verificación: {user?.emailAddresses[0]?.verification?.status}</p>
                  <p className="text-green-600 text-sm">✓ Miembro desde: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">Acciones Rápidas</h3>
                  <div className="space-y-2">
                    <Link 
                      href="/user-profile" 
                      className="block text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Editar Perfil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}