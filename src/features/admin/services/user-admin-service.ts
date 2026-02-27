import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  updateDoc,
  doc,
  serverTimestamp,
  db,
} from '@/lib/firebase/firebase-firestore'
import type { Usuario, RolUsuario } from '@/shared/types/usuario'

export async function obtenerUsuarios(maxResults: number = 50): Promise<Usuario[]> {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(maxResults))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    ...d.data(),
    uid: d.id,
    createdAt: d.data().createdAt?.toDate() || new Date(),
    updatedAt: d.data().updatedAt?.toDate() || new Date(),
  })) as Usuario[]
}

export async function cambiarRolUsuario(uid: string, role: RolUsuario): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    role,
    updatedAt: serverTimestamp(),
  })
}

export async function deshabilitarUsuario(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    disabled: true,
    updatedAt: serverTimestamp(),
  })
}
