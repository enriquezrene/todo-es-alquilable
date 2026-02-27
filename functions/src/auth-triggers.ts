import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore()

  await admin.auth().setCustomUserClaims(user.uid, { role: 'user' })

  const userDoc = await db.collection('users').doc(user.uid).get()

  if (!userDoc.exists) {
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || null,
      phone: '',
      province: '',
      city: '',
      address: '',
      role: 'user',
      activeListingCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }
})
