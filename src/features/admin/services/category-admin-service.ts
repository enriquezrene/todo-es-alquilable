import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  db,
} from '@/lib/firebase/firebase-firestore'
import type { Categoria, CategoriaSugerida } from '@/shared/types/categoria'

export async function obtenerCategorias(): Promise<Categoria[]> {
  const q = query(collection(db, 'categories'), orderBy('name', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate() || new Date(),
  })) as Categoria[]
}

export async function crearCategoria(name: string, icon: string): Promise<string> {
  const docRef = doc(collection(db, 'categories'))
  await setDoc(docRef, {
    name,
    nameLower: name.toLowerCase(),
    icon,
    listingCount: 0,
    isActive: true,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function actualizarCategoria(id: string, data: { name?: string; icon?: string; isActive?: boolean }): Promise<void> {
  const updates: Record<string, unknown> = { ...data }
  if (data.name) updates.nameLower = data.name.toLowerCase()
  await updateDoc(doc(db, 'categories', id), updates)
}

export async function eliminarCategoria(id: string): Promise<void> {
  await deleteDoc(doc(db, 'categories', id))
}

export async function obtenerCategoriasSugeridas(): Promise<CategoriaSugerida[]> {
  const q = query(
    collection(db, 'suggestedCategories'),
    where('status', '==', 'pendiente'),
    orderBy('createdAt', 'asc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate() || new Date(),
  })) as CategoriaSugerida[]
}

export async function aprobarCategoriaSugerida(id: string, icon: string): Promise<void> {
  const sugRef = doc(db, 'suggestedCategories', id)
  const snap = await getDocs(query(collection(db, 'suggestedCategories'), where('__name__', '==', id)))
  if (snap.empty) return

  const data = snap.docs[0].data()
  await crearCategoria(data.name, icon)
  await updateDoc(sugRef, { status: 'aprobada' })
}

export async function rechazarCategoriaSugerida(id: string): Promise<void> {
  await updateDoc(doc(db, 'suggestedCategories', id), { status: 'rechazada' })
}
