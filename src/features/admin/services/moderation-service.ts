import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  getDb,
  type DocumentSnapshot,
} from '@/lib/firebase/firebase-firestore'
import type { Anuncio } from '@/shared/types/anuncio'

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

export async function obtenerAnunciosPendientes(): Promise<Anuncio[]> {
  const q = query(
    collection(getDb(), 'listings'),
    where('status', '==', 'pendiente'),
    orderBy('createdAt', 'asc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(docToAnuncio)
}

export async function aprobarAnuncio(listingId: string, moderatorId: string): Promise<void> {
  await updateDoc(doc(getDb(), 'listings', listingId), {
    status: 'aprobado',
    moderatorId,
    moderatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function rechazarAnuncio(
  listingId: string,
  moderatorId: string,
  reason: string,
): Promise<void> {
  await updateDoc(doc(getDb(), 'listings', listingId), {
    status: 'rechazado',
    rejectionReason: reason,
    moderatorId,
    moderatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function solicitarCambios(
  listingId: string,
  moderatorId: string,
  reason: string,
): Promise<void> {
  await updateDoc(doc(getDb(), 'listings', listingId), {
    status: 'cambios_requeridos',
    rejectionReason: reason,
    moderatorId,
    moderatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function obtenerAnunciosAprobados(): Promise<Anuncio[]> {
  const q = query(
    collection(getDb(), 'listings'),
    where('status', '==', 'aprobado'),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(docToAnuncio)
}

export async function eliminarAnuncio(listingId: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'listings', listingId))
}
