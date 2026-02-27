import * as admin from 'firebase-admin'

admin.initializeApp()

export { onUserCreated } from './auth-triggers'
export { setUserRole } from './set-custom-claims'
