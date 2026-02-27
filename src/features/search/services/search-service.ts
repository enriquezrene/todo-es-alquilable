import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDb,
  type DocumentSnapshot,
  type QueryConstraint,
} from '@/lib/firebase/firebase-firestore'
import type { Anuncio } from '@/shared/types/anuncio'
import type { SearchFilters } from '../types'

const PAGE_SIZE = 20

function docToAnuncio(docSnap: DocumentSnapshot): Anuncio {
  const data = docSnap.data()!
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    moderatedAt: data.moderatedAt?.toDate() || null,
  } as Anuncio
}

export async function buscarAnuncios(
  filters: SearchFilters,
  lastDoc?: DocumentSnapshot,
): Promise<{ anuncios: Anuncio[]; lastDoc: DocumentSnapshot | null; hasMore: boolean }> {
  const constraints: QueryConstraint[] = [where('status', '==', 'aprobado')]

  if (filters.categoryId) {
    constraints.push(where('categoryId', '==', filters.categoryId))
  }

  if (filters.province) {
    constraints.push(where('province', '==', filters.province))
  }

  switch (filters.sortBy) {
    case 'precio_asc':
      constraints.push(orderBy('price', 'asc'))
      break
    case 'precio_desc':
      constraints.push(orderBy('price', 'desc'))
      break
    default:
      constraints.push(orderBy('createdAt', 'desc'))
  }

  constraints.push(limit(PAGE_SIZE + 1))

  if (lastDoc) {
    constraints.push(startAfter(lastDoc))
  }

  const q = query(collection(getDb(), 'listings'), ...constraints)
  const snapshot = await getDocs(q)
  let anuncios = snapshot.docs.map(docToAnuncio)

  // Client-side filters for fields not supported by compound queries
  if (filters.query) {
    const queryLower = filters.query.toLowerCase()
    anuncios = anuncios.filter(
      (a) =>
        a.titleLower.includes(queryLower) ||
        a.description.toLowerCase().includes(queryLower),
    )
  }

  if (filters.priceMin !== undefined) {
    anuncios = anuncios.filter((a) => a.price >= filters.priceMin!)
  }

  if (filters.priceMax !== undefined) {
    anuncios = anuncios.filter((a) => a.price <= filters.priceMax!)
  }

  const hasMore = snapshot.docs.length > PAGE_SIZE
  const last = snapshot.docs[Math.min(snapshot.docs.length - 1, PAGE_SIZE - 1)] || null

  return {
    anuncios: anuncios.slice(0, PAGE_SIZE),
    lastDoc: last,
    hasMore,
  }
}
