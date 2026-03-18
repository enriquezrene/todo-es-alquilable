import { doc, getDoc, updateDoc, serverTimestamp, getDb } from '@/lib/firebase/firebase-firestore'
import type { Usuario } from '@/shared/types/usuario'
import type { FormularioPerfil } from '../types'
import { validarTelefonoEcuador } from '@/lib/dominio/validar-telefono-ecuador'

export async function obtenerPerfil(uid: string): Promise<Usuario | null> {
  const docSnap = await getDoc(doc(getDb(), 'users', uid))
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
  // Server-side validation: phone number is required
  if (!datos.phone || datos.phone.trim() === '') {
    throw new Error('El número de teléfono es requerido')
  }
  
  if (!validarTelefonoEcuador(datos.phone)) {
    throw new Error('El número de teléfono no es válido. Debe tener formato +593XXXXXXXXX')
  }
  
  // Server-side validation: other required fields
  if (!datos.displayName || datos.displayName.trim() === '') {
    throw new Error('El nombre es requerido')
  }
  
  if (!datos.province) {
    throw new Error('La provincia es requerida')
  }
  
  if (!datos.city) {
    throw new Error('La ciudad es requerida')
  }
  
  if (!datos.address || datos.address.trim() === '') {
    throw new Error('La dirección es requerida')
  }

  await updateDoc(doc(getDb(), 'users', uid), {
    ...datos,
    updatedAt: serverTimestamp(),
  })
}
