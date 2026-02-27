import { registrarConEmail, iniciarSesionConEmail, cerrarSesion, actualizarPerfil } from '@/lib/firebase/firebase-auth'
import { doc, setDoc, getDoc, serverTimestamp, getDb } from '@/lib/firebase/firebase-firestore'
import type { FormularioRegistro } from '../types'
import type { RolUsuario } from '@/shared/types/usuario'

export async function registrarUsuario(datos: FormularioRegistro) {
  const credential = await registrarConEmail(datos.email, datos.password)
  const user = credential.user

  await actualizarPerfil(user, { displayName: datos.displayName })

  await setDoc(doc(getDb(), 'users', user.uid), {
    uid: user.uid,
    email: datos.email,
    displayName: datos.displayName,
    photoURL: null,
    phone: datos.phone,
    province: datos.province,
    city: datos.city,
    address: datos.address,
    role: 'user',
    activeListingCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return user
}

export async function iniciarSesion(email: string, password: string) {
  const credential = await iniciarSesionConEmail(email, password)
  return credential.user
}

export async function cerrarSesionUsuario() {
  return cerrarSesion()
}

export async function obtenerRolUsuario(uid: string): Promise<RolUsuario> {
  const userDoc = await getDoc(doc(getDb(), 'users', uid))
  if (userDoc.exists()) {
    return (userDoc.data().role as RolUsuario) || 'user'
  }
  return 'user'
}
