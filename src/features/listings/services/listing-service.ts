import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  getDb,
  type DocumentSnapshot,
  type QueryConstraint,
} from '@/lib/firebase/firebase-firestore'
import type { Anuncio } from '@/shared/types/anuncio'
import type { EstadoAnuncio } from '@/lib/dominio/estados-anuncio'

function docToAnuncio(docSnap: DocumentSnapshot): Anuncio | null {
  if (!docSnap.exists()) return null
  const data = docSnap.data()!
  return {
    id: docSnap.id,
    title: data.title,
    titleLower: data.titleLower,
    description: data.description,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    condition: data.condition,
    price: data.price,
    priceUnit: data.priceUnit,
    province: data.province,
    images: data.images || [],
    thumbnails: data.thumbnails || [],
    ownerId: data.ownerId,
    ownerName: data.ownerName,
    ownerPhone: data.ownerPhone,
    ownerPhotoURL: data.ownerPhotoURL,
    status: data.status,
    rejectionReason: data.rejectionReason || null,
    moderatorId: data.moderatorId || null,
    moderatedAt: data.moderatedAt?.toDate() || null,
    viewCount: data.viewCount || 0,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Anuncio
}

export type CrearAnuncioData = {
  title: string
  description: string
  categoryId: string
  categoryName: string
  condition: string
  price: number
  priceUnit: string
  province: string
  images: string[]
  thumbnails: string[]
  ownerId: string
  ownerName: string
  ownerPhotoURL: string | null
}

export async function crearAnuncio(data: CrearAnuncioData, id?: string): Promise<string> {
  const docRef = id
    ? doc(getDb(), 'listings', id)
    : doc(collection(getDb(), 'listings'))

  await setDoc(docRef, {
    ...data,
    titleLower: data.title.toLowerCase(),
    thumbnails: data.thumbnails,
    status: 'pendiente',
    rejectionReason: null,
    moderatorId: null,
    moderatedAt: null,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function obtenerAnuncioPorId(id: string): Promise<Anuncio | null> {
  const docSnap = await getDoc(doc(getDb(), 'listings', id))
  return docToAnuncio(docSnap)
}

export async function obtenerAnunciosAprobados(
  pageSize: number = 20,
  lastDoc?: DocumentSnapshot,
): Promise<{ anuncios: Anuncio[]; lastDoc: DocumentSnapshot | null }> {
  const constraints: QueryConstraint[] = [
    where('status', '==', 'aprobado'),
    orderBy('createdAt', 'desc'),
    limit(pageSize),
  ]

  if (lastDoc) constraints.push(startAfter(lastDoc))

  const q = query(collection(getDb(), 'listings'), ...constraints)
  const snapshot = await getDocs(q)
  const anuncios = snapshot.docs.map(docToAnuncio).filter(Boolean) as Anuncio[]
  const last = snapshot.docs[snapshot.docs.length - 1] || null

  return { anuncios, lastDoc: last }
}

export async function obtenerAnunciosPorUsuario(
  ownerId: string,
  status?: EstadoAnuncio,
): Promise<Anuncio[]> {
  const constraints: QueryConstraint[] = [
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc'),
  ]

  if (status) constraints.push(where('status', '==', status))

  const q = query(collection(getDb(), 'listings'), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(docToAnuncio).filter(Boolean) as Anuncio[]
}

export async function actualizarAnuncio(
  id: string,
  data: Partial<Omit<Anuncio, 'id' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(doc(getDb(), 'listings', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export type ReenviarAnuncioData = {
  title: string
  description: string
  categoryId: string
  categoryName: string
  condition: string
  price: number
  priceUnit: string
  province: string
  images: string[]
  thumbnails: string[]
}

export async function reenviarAnuncio(id: string, data: ReenviarAnuncioData): Promise<void> {
  await updateDoc(doc(getDb(), 'listings', id), {
    ...data,
    titleLower: data.title.toLowerCase(),
    status: 'pendiente',
    rejectionReason: null,
    updatedAt: serverTimestamp(),
  })
}

export async function eliminarAnuncio(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'listings', id))
}

export async function incrementarVistas(id: string): Promise<void> {
  await updateDoc(doc(getDb(), 'listings', id), {
    viewCount: increment(1),
  })
}
