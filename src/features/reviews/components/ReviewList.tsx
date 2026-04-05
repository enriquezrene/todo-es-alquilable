'use client'

import type { Review } from '@/shared/types/review'
import ReviewCard from './ReviewCard'

type ReviewListProps = {
  reviews: Review[]
  showStatus?: boolean
  loading?: boolean
}

export default function ReviewList({ reviews, showStatus = false, loading = false }: ReviewListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay reseñas todavía</p>
        <p className="text-sm text-gray-400 mt-2">
          Sé el primero en compartir tu experiencia
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard 
          key={review.id} 
          review={review} 
          showStatus={showStatus}
        />
      ))}
    </div>
  )
}
