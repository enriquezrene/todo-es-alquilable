'use client'

import Link from 'next/link'
import OrdenDeTrabajoButton from '@/features/listings/components/OrdenDeTrabajoButton'

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Cómo Funciona?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu plataforma segura y confiable para alquilar cualquier objeto en Ecuador
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              100% Seguro y Protegido
            </h3>
            <p className="text-gray-600 mb-4">
              Todas las transacciones están respaldadas por nuestro sistema de orden de trabajo. 
              Este documento legal garantiza que tanto el arrendador como el arrendatario 
              cumplan con los términos acordados, proporcionando total tranquilidad.
            </p>
            <p className="text-sm text-blue-600 font-medium">
              🛡️ Protección total para ambas partes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Proceso Simple y Rápido
            </h3>
            <p className="text-gray-600 mb-4">
              Contacta directamente con el propietario por WhatsApp, acuerden los términos 
              y descarguen la orden de trabajo. Sin complicaciones, sin intermediarios, 
              solo alquileres seguros y directos.
            </p>
            <p className="text-sm text-green-600 font-medium">
              ⚡ Alquileres en minutos, no en días
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Nuestro Sistema de Garantías
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Encuentra</h4>
              <p className="text-gray-600 text-sm">
                Busca el objeto que necesitas alquilar
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Acuerda</h4>
              <p className="text-gray-600 text-sm">
                Contacta por WhatsApp y define los términos
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Formaliza</h4>
              <p className="text-gray-600 text-sm">
                Descarga y firma la orden de trabajo
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ¿Por qué confiar en nosotros?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">
                  <strong>Documentos legales válidos</strong> en Ecuador
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">
                  <strong>Protección total</strong> para ambas partes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">
                  <strong>Sin costos ocultos</strong> ni comisiones
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">
                  <strong>Soporte directo</strong> cuando lo necesites
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para alquilar con seguridad?
          </h2>
          <p className="text-gray-600 mb-6">
            Descarga la orden de trabajo y comienza a alquilar con total tranquilidad
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <OrdenDeTrabajoButton 
              className="justify-center"
              variant="primary"
              size="lg"
            />
            <Link href="/buscar" className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Explorar Artículos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
