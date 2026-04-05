'use client'

import type { ReviewStats } from '@/shared/types/review'
import StarRating from './StarRating'

type LenderRatingProps = {
  stats: ReviewStats
  size?: 'sm' | 'md' | 'lg'
}

export default function LenderRating({ stats, size = 'md' }: LenderRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const containerClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  }

  if (stats.totalReviews === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg ${containerClasses[size]}`}>
        <p className="text-gray-500 text-center">
          Sin reseñas todavía
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-blue-50 rounded-lg ${containerClasses[size]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium text-blue-900 ${sizeClasses[size]}`}>
          Calificación Promedio
        </span>
        <span className={`text-blue-700 ${sizeClasses[size]}`}>
          ({stats.totalReviews} reseñas)
        </span>
      </div>
      
      <StarRating rating={stats.averageRating} size={size} />
      
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-12">5 ★</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full" 
              style={{ width: `${(stats.ratingDistribution[5] / stats.totalReviews) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600 w-8 text-right">
            {stats.ratingDistribution[5]}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-12">4 ★</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full" 
              style={{ width: `${(stats.ratingDistribution[4] / stats.totalReviews) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600 w-8 text-right">
            {stats.ratingDistribution[4]}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-12">3 ★</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full" 
              style={{ width: `${(stats.ratingDistribution[3] / stats.totalReviews) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600 w-8 text-right">
            {stats.ratingDistribution[3]}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-12">2 ★</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full" 
              style={{ width: `${(stats.ratingDistribution[2] / stats.totalReviews) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600 w-8 text-right">
            {stats.ratingDistribution[2]}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-12">1 ★</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full" 
              style={{ width: `${(stats.ratingDistribution[1] / stats.totalReviews) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600 w-8 text-right">
            {stats.ratingDistribution[1]}
          </span>
        </div>
      </div>
    </div>
  )
}
