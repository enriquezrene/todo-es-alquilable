/**
 * Seed script for initial data.
 * Run after Firebase project is configured:
 *   npx ts-node scripts/seed-data.ts
 *
 * This script creates:
 * - 12 initial categories
 * - A super_admin user document (you must create the auth user first)
 */

// This is a reference script. In production, run it with Firebase Admin SDK
// or use Firebase console to manually seed the data.

import { categoriasIniciales } from '../src/lib/dominio/categorias-iniciales'

console.log('=== Seed Data Reference ===\n')

console.log('Categories to create in Firestore /categories:')
categoriasIniciales.forEach((cat, i) => {
  console.log(`  ${i + 1}. ${cat.icono} ${cat.nombre}`)
})

console.log('\nFirestore document structure for each category:')
console.log(
  JSON.stringify(
    {
      name: 'Herramientas',
      nameLower: 'herramientas',
      icon: '🔧',
      listingCount: 0,
      isActive: true,
      createdAt: 'serverTimestamp()',
    },
    null,
    2,
  ),
)

console.log('\nSuper admin user document (/users/{uid}):')
console.log(
  JSON.stringify(
    {
      uid: '<FIREBASE_AUTH_UID>',
      email: 'admin@todoesalquilable.com',
      displayName: 'Super Admin',
      photoURL: null,
      phone: '+593990000000',
      province: 'Pichincha',
      city: 'Quito',
      address: 'Dirección admin',
      role: 'super_admin',
      activeListingCount: 0,
      createdAt: 'serverTimestamp()',
      updatedAt: 'serverTimestamp()',
    },
    null,
    2,
  ),
)

console.log('\nCustom claims for super admin:')
console.log('  admin.auth().setCustomUserClaims(uid, { role: "super_admin" })')
