import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

/**
 * One-time callable function to bootstrap the first super_admin.
 * Only succeeds if no super_admin exists in the users collection.
 * The caller must be authenticated and their Firestore doc must have role: 'super_admin'.
 */
export const bootstrapAdmin = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes iniciar sesión')
  }

  const db = admin.firestore()
  const uid = context.auth.uid

  // Check if any super_admin already has the custom claim set
  const userDoc = await db.collection('users').doc(uid).get()
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Usuario no encontrado en Firestore')
  }

  const userData = userDoc.data()!
  if (userData.role !== 'super_admin') {
    throw new functions.https.HttpsError('permission-denied', 'Solo usuarios con role super_admin en Firestore')
  }

  // Verify no one else already has the super_admin custom claim
  const existingAdmins = await db.collection('users').where('role', '==', 'super_admin').get()
  for (const adminDoc of existingAdmins.docs) {
    if (adminDoc.id === uid) continue
    const user = await admin.auth().getUser(adminDoc.id)
    if (user.customClaims?.role === 'super_admin') {
      throw new functions.https.HttpsError('already-exists', 'Ya existe un super_admin con claims activos')
    }
  }

  // Set the custom claim
  await admin.auth().setCustomUserClaims(uid, { role: 'super_admin' })

  return { success: true, message: 'Custom claim super_admin establecido. Refresca tu sesión.' }
})
