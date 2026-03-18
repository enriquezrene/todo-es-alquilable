import { doc, getDoc, getDb } from '@/lib/firebase/firebase-firestore'

export async function obtenerTelefonoUsuario(userId: string): Promise<string | null> {
  try {
    const userDoc = await getDoc(doc(getDb(), 'users', userId))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.phone || null
    }
    return null
  } catch (error) {
    console.error('Error fetching user phone:', error)
    return null
  }
}
