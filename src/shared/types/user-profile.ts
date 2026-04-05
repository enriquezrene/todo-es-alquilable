export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  cedula?: string
  cedulaDocumentId?: string
  role: 'user' | 'renter'
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface ProfileStats {
  totalRentals: number
  completedRentals: number
  averageRating: number
}
