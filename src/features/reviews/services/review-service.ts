import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { getDb } from '@/lib/firebase/firebase-firestore'
import type { Review, ReviewStats } from '@/shared/types/review'
import { registrarError } from '@/lib/registrar-error'

const REVIEWS_COLLECTION = 'reviews'

export async function crearReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
  try {
    const review: Omit<Review, 'id'> = {
      ...reviewData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(getDb(), REVIEWS_COLLECTION), review)
    return docRef.id
  } catch (error) {
    registrarError(error, 'ReviewService:crearReview')
    throw error
  }
}

export async function obtenerReviewsPorListing(listingId: string, limitCount = 10) {
  try {
    const q = query(
      collection(getDb(), REVIEWS_COLLECTION),
      where('listingId', '==', listingId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(docToReview)
  } catch (error) {
    registrarError(error, 'ReviewService:obtenerReviewsPorListing')
    throw error
  }
}

export async function obtenerReviewsPendientes() {
  try {
    const q = query(
      collection(getDb(), REVIEWS_COLLECTION),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(docToReview)
  } catch (error) {
    registrarError(error, 'ReviewService:obtenerReviewsPendientes')
    throw error
  }
}

export async function aprobarReview(reviewId: string, moderatorId: string, moderatorNote?: string) {
  try {
    const reviewRef = doc(getDb(), REVIEWS_COLLECTION, reviewId)
    await updateDoc(reviewRef, {
      status: 'approved',
      moderatedBy: moderatorId,
      moderatorNote,
      updatedAt: new Date()
    })
  } catch (error) {
    registrarError(error, 'ReviewService:aprobarReview')
    throw error
  }
}

export async function rechazarReview(reviewId: string, moderatorId: string, moderatorNote?: string) {
  try {
    const reviewRef = doc(getDb(), REVIEWS_COLLECTION, reviewId)
    await updateDoc(reviewRef, {
      status: 'rejected',
      moderatedBy: moderatorId,
      moderatorNote,
      updatedAt: new Date()
    })
  } catch (error) {
    registrarError(error, 'ReviewService:rechazarReview')
    throw error
  }
}

export async function solicitarActualizacionReview(reviewId: string, moderatorId: string, note: string) {
  try {
    const reviewRef = doc(getDb(), REVIEWS_COLLECTION, reviewId)
    await updateDoc(reviewRef, {
      status: 'pending',
      moderatedBy: moderatorId,
      moderatorNote: note,
      updatedAt: new Date()
    })
  } catch (error) {
    registrarError(error, 'ReviewService:solicitarActualizacionReview')
    throw error
  }
}

export async function obtenerEstadisticasReviewer(listerId: string): Promise<ReviewStats> {
  try {
    const q = query(
      collection(getDb(), REVIEWS_COLLECTION),
      where('listerId', '==', listerId),
      where('status', '==', 'approved')
    )

    const querySnapshot = await getDocs(q)
    const reviews = querySnapshot.docs.map(docToReview)

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.rating as keyof typeof dist]++
      return dist
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
      ratingDistribution
    }
  } catch (error) {
    registrarError(error, 'ReviewService:obtenerEstadisticasReviewer')
    throw error
  }
}

export async function obtenerReviewPorId(reviewId: string): Promise<Review | null> {
  try {
    const reviewDoc = await getDoc(doc(getDb(), REVIEWS_COLLECTION, reviewId))
    return reviewDoc.exists() ? docToReview(reviewDoc) : null
  } catch (error) {
    registrarError(error, 'ReviewService:obtenerReviewPorId')
    throw error
  }
}

export async function usuarioPuedeReviewar(listingId: string, userId: string): Promise<boolean> {
  try {
    // This would check if user has actually rented this listing
    // For now, we'll implement a basic check - in a real app, you'd check rental history
    const q = query(
      collection(getDb(), REVIEWS_COLLECTION),
      where('listingId', '==', listingId),
      where('renterId', '==', userId)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.empty
  } catch (error) {
    registrarError(error, 'ReviewService:usuarioPuedeReviewar')
    throw error
  }
}

function docToReview(doc: { id: string; data(): Record<string, unknown> }): Review {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = doc.data() as any
  return {
    id: doc.id,
    listingId: data.listingId,
    renterId: data.renterId,
    listerId: data.listerId,
    rating: data.rating,
    description: data.description,
    status: data.status,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
    moderatedBy: data.moderatedBy,
    moderatorNote: data.moderatorNote
  }
}
