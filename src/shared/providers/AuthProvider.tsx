'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { getAuthInstance } from '@/lib/firebase/firebase-config'
import { doc, getDoc, getDb } from '@/lib/firebase/firebase-firestore'
import type { RolUsuario } from '@/shared/types/usuario'
import { registrarError } from '@/lib/registrar-error'

type AuthContextValue = {
  user: User | null
  role: RolUsuario | null
  loading: boolean
  userProfile: {
    phone?: string
  } | null
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
  userProfile: null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<RolUsuario | null>(null)
  const [userProfile, setUserProfile] = useState<{ phone?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuthInstance(), async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult()
        let userRole = tokenResult.claims.role as RolUsuario | undefined

        if (!userRole || userRole === 'user') {
          try {
            const userDoc = await getDoc(doc(getDb(), 'users', firebaseUser.uid))
            if (userDoc.exists()) {
              const userData = userDoc.data()
              userRole = userData.role as RolUsuario
              setUserProfile({
                phone: userData.phone
              })
            }
          } catch (e) {
            registrarError(e, 'AuthProvider:role-fallback')
          }
        }

        setRole(userRole || 'user')
      } else {
        setRole(null)
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, role, loading, userProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
