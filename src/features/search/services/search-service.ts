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
const FUZZY_THRESHOLD = 0.6

function bigrams(str: string): Set<string> {
  const s = str.toLowerCase()
  const set = new Set<string>()
  for (let i = 0; i < s.length - 1; i++) {
    set.add(s.slice(i, i + 2))
  }
  return set
}

function similarity(a: string, b: string): number {
  const bigramsA = bigrams(a)
  const bigramsB = bigrams(b)
  if (bigramsA.size === 0 && bigramsB.size === 0) return 1
  if (bigramsA.size === 0 || bigramsB.size === 0) return 0
  let intersection = 0
  bigramsA.forEach((bg) => { if (bigramsB.has(bg)) intersection++ })
  return (2 * intersection) / (bigramsA.size + bigramsB.size)
}

function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase()
  const queryLower = query.toLowerCase()

  // Exact substring match is always a hit
  if (textLower.includes(queryLower)) return true

  // Check each word in the text against each query term
  const queryTerms = queryLower.split(/\s+/).filter(Boolean)
  const textWords = textLower.split(/\s+/).filter(Boolean)

  return queryTerms.every((term) =>
    textWords.some((word) => word.length >= 3 && similarity(word, term) >= FUZZY_THRESHOLD),
  )
}

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
    anuncios = anuncios.filter(
      (a) =>
        fuzzyMatch(a.title, filters.query) ||
        fuzzyMatch(a.description, filters.query),
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
