'use client'

import type { Review } from '@/shared/types/review'
import { formatearFecha } from '@/lib/dominio/formatear-fecha'
import Badge from '@/shared/components/ui/Badge'

type ReviewCardProps = {
  review: Review
  showStatus?: boolean
}

export default function ReviewCard({ review, showStatus = false }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">Usuario Reviewer</h4>
            {showStatus && (
              <Badge variant={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'error' : 'warning'}>
                {review.status === 'approved' && 'Aprobada'}
                {review.status === 'rejected' && 'Rechazada'}
                {review.status === 'pending' && 'Pendiente'}
              </Badge>
            )}
          </div>
          
          {renderStars(review.rating)}
        </div>
        
        <div className="text-sm text-gray-500">
          {formatearFecha(review.createdAt)}
        </div>
      </div>

      {review.description && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {review.description}
        </p>
      )}

      {review.moderatorNote && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Nota del moderador:</strong> {review.moderatorNote}
          </p>
        </div>
      )}
    </div>
  )
}
