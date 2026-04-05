'use client'

import Link from 'next/link'
import OrdenDeTrabajoButton from '@/features/listings/components/OrdenDeTrabajoButton'

export default function OrdenDeTrabajoPage() {

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Orden de Trabajo
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Documento oficial para acuerdos de alquiler
            </p>
            <p className="text-gray-500">
              Descarga y firma este documento para formalizar tu acuerdo de alquiler
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">¿Qué es este documento?</h3>
                <p className="text-gray-600">
                  La orden de trabajo es un documento legal que protege tanto al arrendador 
                  como al arrendatario, estableciendo los términos y condiciones del alquiler.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">¿Por qué es importante?</h3>
                <p className="text-gray-600">
                  Este documento garantiza que ambas partes cumplan con lo acordado, 
                  proporcionando seguridad y confianza en la transacción.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Descargar Orden de Trabajo
              </h2>
              <p className="text-gray-600 mb-6">
                Haz clic en el botón para descargar el documento PDF
              </p>
              <OrdenDeTrabajoButton 
                className="justify-center"
                variant="primary"
                size="lg"
              />
            </div>

            <div className="text-sm text-gray-500">
              <p>Formato: PDF | Tamaño: ~90 KB</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Descarga la orden de trabajo</li>
              <li>Ambas partes deben leer cuidadosamente los términos</li>
              <li>Completar los datos requeridos</li>
              <li>Firmar el documento</li>
              <li>Conservar una copia para cada parte</li>
            </ol>
          </div>

          <div className="text-center">
            <Link href="/como-funciona" className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              ¿Cómo funciona?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
