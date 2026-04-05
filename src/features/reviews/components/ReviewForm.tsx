'use client'

import { useState } from 'react'
import Button from '@/shared/components/ui/Button'

type ReviewFormProps = {
  listingId: string
  listerId: string
  onReviewSubmitted?: () => void
  onCancel?: () => void
}

export default function ReviewForm({ listingId, listerId, onReviewSubmitted, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      return
    }

    setSubmitting(true)
    try {
      // TODO: Implement actual review submission
      console.log('Submitting review:', { listingId, listerId, rating, description })
      
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="text-2xl transition-colors"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
          >
            <span className={star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Escribir una Reseña</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación *
          </label>
          {renderStars()}
          <p className="text-sm text-gray-500 mt-1">
            Haz clic en las estrellas para calificar
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            rows={4}
            placeholder="Comparte tu experiencia con este artículo..."
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-1">
            {description.length}/500 caracteres
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={submitting || rating === 0}
          >
            {submitting ? 'Enviando...' : 'Enviar Reseña'}
          </Button>
        </div>
      </form>
    </div>
  )
}
