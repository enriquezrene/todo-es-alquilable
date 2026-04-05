'use client'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

export default function StarRating({ rating, size = 'md', showCount = true }: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const renderStars = () => {
    return (
      <div className={`flex gap-1 ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {renderStars()}
      {showCount && (
        <span className="text-gray-600">
          {rating.toFixed(1)} de 5
        </span>
      )}
    </div>
  )
}
