'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/providers/AuthProvider'
import type { RolUsuario } from '@/shared/types/usuario'
import Spinner from '@/shared/components/ui/Spinner'

type AuthGuardProps = {
  children: React.ReactNode
  requiredRole?: RolUsuario
}

const roleHierarchy: Record<RolUsuario, number> = {
  user: 0,
  moderator: 1,
  admin: 2,
  super_admin: 3,
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/iniciar-sesion')
      return
    }

    if (requiredRole && role) {
      if (roleHierarchy[role] < roleHierarchy[requiredRole]) {
        router.push('/')
      }
    }
  }, [user, role, loading, requiredRole, router])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) return null

  if (requiredRole && role && roleHierarchy[role] < roleHierarchy[requiredRole]) {
    return null
  }

  return <>{children}</>
}
