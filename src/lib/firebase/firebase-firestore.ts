import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type DocumentData,
  type QueryConstraint,
  serverTimestamp,
  increment,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from './firebase-config'

export {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
}
export type { DocumentData, QueryConstraint, DocumentSnapshot }

export { db }
