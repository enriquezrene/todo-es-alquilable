'use client'

import { useState } from 'react'
import { useAuth } from '@/shared/providers/AuthProvider'
import type { Anuncio } from '@/shared/types/anuncio'
import Button from '@/shared/components/ui/Button'
import Modal from '@/shared/components/ui/Modal'
import RentalRequestForm from './RentalRequestForm'

type Props = {
  anuncio: Anuncio
  className?: string
}

export default function RentalRequestButton({ anuncio, className = '' }: Props) {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleClick = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    setShowModal(true)
  }

  const handleSuccess = () => {
    setShowModal(false)
    // You could show a success toast here
    alert('Solicitud de renta enviada correctamente. El lister te contactará pronto.')
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  const handleLoginRedirect = () => {
    window.location.href = '/iniciar-sesion'
  }

  // Check if the item is available
  if (anuncio.availabilityStatus === 'alquilado') {
    return (
      <Button disabled className={`w-full gap-2 bg-gray-400 cursor-not-allowed ${className}`}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        Artículo no disponible
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={handleClick}
        className={`w-full gap-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 ${className}`}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
        </svg>
        Enviar solicitud de renta
      </Button>

      {/* Rental Request Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCancel}
        title="Solicitar renta"
      >
        {user && (
          <RentalRequestForm
            anuncio={anuncio}
            renterId={user.uid}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </Modal>

      {/* Login Required Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Inicia sesión para continuar"
      >
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Necesitas una cuenta para solicitar rentas
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            Inicia sesión o crea una cuenta para poder contactar a los listers y solicitar artículos.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handleLoginRedirect}
              className="flex-1"
            >
              Iniciar sesión
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLoginModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
