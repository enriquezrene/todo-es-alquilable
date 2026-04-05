'use client'

import { useEffect, useState } from 'react'
import Container from '@/shared/components/layout/Container'
import { obtenerReviewsPendientes, aprobarReview, rechazarReview, solicitarActualizacionReview } from '@/features/reviews/services/review-service'
import type { Review } from '@/shared/types/review'
import { formatearFecha } from '@/lib/dominio/formatear-fecha'
import { etiquetasEstadoReview } from '@/lib/dominio/estados-review'
import { useAuth } from '@/shared/providers/AuthProvider'
import { useToast } from '@/shared/providers/ToastProvider'
import Badge from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'
import AuthGuard from '@/features/auth/components/AuthGuard'

export default function AdminReviewsPage() {
  const { user } = useAuth()
  const { mostrarToast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteType, setNoteType] = useState<'approve' | 'reject' | 'update'>('approve')
  const [note, setNote] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    cargarReviewsPendientes()
  }, [])

  const cargarReviewsPendientes = async () => {
    try {
      const pendingReviews = await obtenerReviewsPendientes()
      setReviews(pendingReviews)
    } catch (error) {
      console.error('Error loading pending reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAprobar = async (review: Review) => {
    if (!user) return

    setSelectedReview(review)
    setNoteType('approve')
    setNote('')
    setShowNoteModal(true)
  }

  const handleRechazar = async (review: Review) => {
    if (!user) return

    setSelectedReview(review)
    setNoteType('reject')
    setNote('')
    setShowNoteModal(true)
  }

  const handleSolicitarActualizacion = async (review: Review) => {
    if (!user) return

    setSelectedReview(review)
    setNoteType('update')
    setNote('')
    setShowNoteModal(true)
  }

  const confirmarAccion = async () => {
    if (!selectedReview || !user) return

    setProcessing(true)
    try {
      switch (noteType) {
        case 'approve':
          await aprobarReview(selectedReview.id, user.uid, note || undefined)
          mostrarToast('Reseña aprobada exitosamente', 'success')
          break
        case 'reject':
          if (!note.trim()) {
            mostrarToast('Debes agregar una nota para rechazar la reseña', 'error')
            return
          }
          await rechazarReview(selectedReview.id, user.uid, note)
          mostrarToast('Reseña rechazada', 'success')
          break
        case 'update':
          if (!note.trim()) {
            mostrarToast('Debes agregar una nota para solicitar actualización', 'error')
            return
          }
          await solicitarActualizacionReview(selectedReview.id, user.uid, note)
          mostrarToast('Solicitud de actualización enviada', 'success')
          break
      }

      setShowNoteModal(false)
      setSelectedReview(null)
      setNote('')
      await cargarReviewsPendientes()
    } catch {
      mostrarToast('Error al procesar la reseña', 'error')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Container>
    )
  }

  return (
    <AuthGuard requiredRole="admin">
      <Container>
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reseñas Pendientes</h1>
            <p className="mt-2 text-gray-600">
              Revisa y aprueba las reseñas enviadas por los usuarios
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay reseñas pendientes de aprobación</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="font-medium text-gray-900">Reseña para: {review.listerId}</h3>
                        <Badge variant={review.status === 'pending' ? 'warning' : 'info'}>
                          {etiquetasEstadoReview[review.status as keyof typeof etiquetasEstadoReview]}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Anuncio ID:</strong> {review.listingId}</p>
                        <p><strong>Rating:</strong> {review.rating} / 5</p>
                        <p><strong>Fecha:</strong> {formatearFecha(review.createdAt)}</p>
                        {review.description && (
                          <p><strong>Descripción:</strong> {review.description}</p>
                        )}
                        {review.moderatorNote && (
                          <p><strong>Nota anterior:</strong> {review.moderatorNote}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleAprobar(review)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRechazar(review)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Rechazar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSolicitarActualizacion(review)}
                      >
                        Solicitar Actualización
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note Modal */}
          {showNoteModal && selectedReview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">
                  {noteType === 'approve' && 'Aprobar Reseña'}
                  {noteType === 'reject' && 'Rechazar Reseña'}
                  {noteType === 'update' && 'Solicitar Actualización'}
                </h3>

                {(noteType === 'reject' || noteType === 'update') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nota para el reviewer
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      rows={4}
                      placeholder={noteType === 'reject' 
                        ? 'Explica por qué se rechaza esta reseña...' 
                        : 'Explica qué cambios se necesitan...'
                      }
                    />
                  </div>
                )}

                {noteType === 'approve' && (
                  <p className="text-gray-600 mb-4">
                    ¿Estás seguro que quieres aprobar esta reseña?
                  </p>
                )}

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowNoteModal(false)}
                    disabled={processing}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={confirmarAccion}
                    disabled={processing || ((noteType === 'reject' || noteType === 'update') && !note.trim())}
                  >
                    {processing ? 'Procesando...' : (
                      <>
                        {noteType === 'approve' && 'Aprobar'}
                        {noteType === 'reject' && 'Rechazar'}
                        {noteType === 'update' && 'Solicitar Actualización'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </AuthGuard>
  )
}
