import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

type SetRoleData = {
  targetUid: string
  role: 'user' | 'moderator' | 'admin' | 'super_admin'
}

export const setUserRole = functions.https.onCall(async (data: SetRoleData, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes iniciar sesión')
  }

  const callerClaims = context.auth.token
  if (callerClaims.role !== 'super_admin') {
    throw new functions.https.HttpsError('permission-denied', 'Solo super_admin puede asignar roles')
  }

  const { targetUid, role } = data
  const validRoles = ['user', 'moderator', 'admin', 'super_admin']
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Rol no válido')
  }

  await admin.auth().setCustomUserClaims(targetUid, { role })

  await admin.firestore().collection('users').doc(targetUid).update({
    role,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  return { success: true }
})
