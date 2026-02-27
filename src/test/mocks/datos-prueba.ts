import type { Usuario } from '@/shared/types/usuario'
import type { Anuncio } from '@/shared/types/anuncio'
import type { Categoria } from '@/shared/types/categoria'

export function crearUsuarioPrueba(overrides: Partial<Usuario> = {}): Usuario {
  return {
    uid: 'test-uid-1',
    email: 'test@ejemplo.com',
    displayName: 'Usuario Prueba',
    photoURL: null,
    phone: '+593991234567',
    province: 'Pichincha',
    city: 'Quito',
    address: 'Av. Test 123',
    role: 'user',
    activeListingCount: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }
}

export function crearAnuncioPrueba(overrides: Partial<Anuncio> = {}): Anuncio {
  return {
    id: 'test-listing-1',
    title: 'Taladro eléctrico Bosch',
    titleLower: 'taladro eléctrico bosch',
    description: 'Taladro eléctrico en perfecto estado, ideal para uso doméstico.',
    categoryId: 'cat-1',
    categoryName: 'Herramientas',
    condition: 'buen_estado',
    price: 15,
    priceUnit: 'dia',
    province: 'Pichincha',
    images: ['https://example.com/img1.jpg'],
    thumbnails: ['https://example.com/thumb1.jpg'],
    ownerId: 'test-uid-1',
    ownerName: 'Usuario Prueba',
    ownerPhone: '+593991234567',
    ownerPhotoURL: null,
    status: 'aprobado',
    rejectionReason: null,
    moderatorId: null,
    moderatedAt: null,
    viewCount: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    ...overrides,
  }
}

export function crearCategoriaPrueba(overrides: Partial<Categoria> = {}): Categoria {
  return {
    id: 'cat-1',
    name: 'Herramientas',
    nameLower: 'herramientas',
    icon: '🔧',
    listingCount: 0,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    ...overrides,
  }
}
