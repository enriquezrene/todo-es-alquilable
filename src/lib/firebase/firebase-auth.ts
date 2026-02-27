import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth'
import { auth } from './firebase-config'

export async function registrarConEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function iniciarSesionConEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function cerrarSesion() {
  return firebaseSignOut(auth)
}

export async function actualizarPerfil(user: User, data: { displayName?: string; photoURL?: string }) {
  return updateProfile(user, data)
}

export function observarEstadoAuth(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback)
}
