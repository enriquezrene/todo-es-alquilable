import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
  db,
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
    collection(db, 'listings'),
    where('status', '==', 'pendiente'),
    orderBy('createdAt', 'asc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(docToAnuncio)
}

export async function aprobarAnuncio(listingId: string, moderatorId: string): Promise<void> {
  await updateDoc(doc(db, 'listings', listingId), {
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
  await updateDoc(doc(db, 'listings', listingId), {
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
  await updateDoc(doc(db, 'listings', listingId), {
    status: 'cambios_requeridos',
    rejectionReason: reason,
    moderatorId,
    moderatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
