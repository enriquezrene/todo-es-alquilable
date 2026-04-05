import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getDb,
} from '@/lib/firebase/firebase-firestore'
import type { UserProfile } from '@/shared/types/user-profile'
import { registrarError } from '@/lib/registrar-error'

const PROFILES_COLLECTION = 'user_profiles'

export async function buscarUsuariosPorNombre(searchTerm: string, maxResults: number = 10): Promise<UserProfile[]> {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return []
    }

    const term = searchTerm.trim().toLowerCase()
    
    // Search in firstName and lastName fields
    const q = query(
      collection(getDb(), PROFILES_COLLECTION),
      where('status', '==', 'approved'),
      orderBy('firstName'),
      limit(maxResults * 2) // Get more results to filter
    )

    const querySnapshot = await getDocs(q)
    const allProfiles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserProfile))

    // Filter profiles that match the search term in firstName or lastName
    const filteredProfiles = allProfiles.filter(profile => {
      const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase()
      const firstName = profile.firstName.toLowerCase()
      const lastName = profile.lastName.toLowerCase()
      
      return (
        firstName.includes(term) ||
        lastName.includes(term) ||
        fullName.includes(term)
      )
    })

    // Return limited results
    return filteredProfiles.slice(0, maxResults)
  } catch (error) {
    registrarError(error, 'UserSearchService:buscarUsuariosPorNombre')
    return []
  }
}

export async function buscarUsuariosPorEmail(email: string): Promise<UserProfile[]> {
  try {
    if (!email || email.trim().length < 3) {
      return []
    }

    const emailTerm = email.trim().toLowerCase()
    
    const q = query(
      collection(getDb(), PROFILES_COLLECTION),
      where('status', '==', 'approved'),
      where('email', '>=', emailTerm),
      where('email', '<=', emailTerm + '\uf8ff'),
      orderBy('email'),
      limit(10)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserProfile))
  } catch (error) {
    registrarError(error, 'UserSearchService:buscarUsuariosPorEmail')
    return []
  }
}

export async function buscarUsuarios(searchTerm: string): Promise<UserProfile[]> {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return []
    }

    const term = searchTerm.trim()
    
    // Check if it looks like an email (contains @)
    if (term.includes('@')) {
      return await buscarUsuariosPorEmail(term)
    } else {
      return await buscarUsuariosPorNombre(term)
    }
  } catch (error) {
    registrarError(error, 'UserSearchService:buscarUsuarios')
    return []
  }
}
