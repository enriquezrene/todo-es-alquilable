export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Review {
  id: string
  listingId: string
  renterId: string
  listerId: string
  rating: number // 1-5
  description?: string // optional, max 500 chars
  status: ReviewStatus
  createdAt: Date
  updatedAt: Date
  moderatedBy?: string // admin uid who moderated
  moderatorNote?: string // admin note for rejection/update request
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}
