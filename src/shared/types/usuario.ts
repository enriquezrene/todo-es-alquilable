export type RolUsuario = 'user' | 'moderator' | 'admin' | 'super_admin'

export type Usuario = {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  phone: string // Required field - users must have a phone number
  province: string
  city: string
  address: string
  role: RolUsuario
  activeListingCount: number
  createdAt: Date
  updatedAt: Date
}
