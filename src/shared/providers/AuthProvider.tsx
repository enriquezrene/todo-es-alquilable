'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase/firebase-config'
import type { RolUsuario } from '@/shared/types/usuario'

type AuthContextValue = {
  user: User | null
  role: RolUsuario | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<RolUsuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult()
        setRole((tokenResult.claims.role as RolUsuario) || 'user')
      } else {
        setRole(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, role, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
