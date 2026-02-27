import { doc, getDoc, updateDoc, serverTimestamp, db } from '@/lib/firebase/firebase-firestore'
import type { Usuario } from '@/shared/types/usuario'
import type { FormularioPerfil } from '../types'

export async function obtenerPerfil(uid: string): Promise<Usuario | null> {
  const docSnap = await getDoc(doc(db, 'users', uid))
  if (!docSnap.exists()) return null
  const data = docSnap.data()
  return {
    ...data,
    uid: docSnap.id,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Usuario
}

export async function actualizarPerfil(uid: string, datos: FormularioPerfil): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    ...datos,
    updatedAt: serverTimestamp(),
  })
}
