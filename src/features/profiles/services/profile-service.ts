import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getDb,
} from '@/lib/firebase/firebase-firestore'
import type { UserProfile } from '@/shared/types/user-profile'
import { ESTADOS_PERFIL } from '@/lib/dominio/estados-perfil'
import { registrarError } from '@/lib/registrar-error'

const PROFILES_COLLECTION = 'user_profiles'

export async function crearPerfil(profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const profile: Omit<UserProfile, 'id'> = {
      ...profileData,
      role: 'renter',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(getDb(), PROFILES_COLLECTION), profile)
    return docRef.id
  } catch (error) {
    registrarError(error, 'ProfileService:crearPerfil')
    throw error
  }
}

export async function actualizarPerfil(id: string, data: Partial<UserProfile>) {
  try {
    await updateDoc(doc(getDb(), PROFILES_COLLECTION, id), {
      ...data,
      updatedAt: new Date()
    })
  } catch (error) {
    registrarError(error, 'ProfileService:actualizarPerfil')
    throw error
  }
}

export async function obtenerPerfilPorId(id: string): Promise<UserProfile | null> {
  try {
    const docSnap = await getDoc(doc(getDb(), PROFILES_COLLECTION, id))
    return docSnap.exists() ? docToProfile(docSnap) : null
  } catch (error) {
    registrarError(error, 'ProfileService:obtenerPerfilPorId')
    throw error
  }
}

export async function obtenerPerfilesPorEstado(status: typeof ESTADOS_PERFIL[keyof typeof ESTADOS_PERFIL]): Promise<UserProfile[]> {
  try {
    const q = query(
      collection(getDb(), PROFILES_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(docToProfile)
  } catch (error) {
    registrarError(error, 'ProfileService:obtenerPerfilesPorEstado')
    throw error
  }
}

export async function obtenerPerfilPorEmail(email: string): Promise<UserProfile | null> {
  try {
    const q = query(
      collection(getDb(), PROFILES_COLLECTION),
      where('email', '==', email),
      limit(1)
    )

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return null
    }

    return docToProfile(querySnapshot.docs[0])
  } catch (error) {
    registrarError(error, 'ProfileService:obtenerPerfilPorEmail')
    throw error
  }
}

function docToProfile(doc: { id: string; data(): Record<string, unknown> }): UserProfile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = doc.data() as any
  return {
    id: doc.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    cedula: data.cedula,
    cedulaDocumentId: data.cedulaDocumentId,
    role: data.role,
    status: data.status,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  }
}
