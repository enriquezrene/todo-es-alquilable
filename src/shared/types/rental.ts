export type RentalStatus = 'active' | 'completed' | 'cancelled'

export interface Rental {
  id: string
  listingId: string
  renterId: string
  renterName: string
  renterPhone: string
  listerId: string
  startDate: Date
  endDate?: Date
  status: RentalStatus
  createdAt: Date
  updatedAt: Date
}

export interface RentalStats {
  activeRentals: number
  completedRentals: number
  totalRentals: number
}
