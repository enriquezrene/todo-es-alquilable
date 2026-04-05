import {
  doc,
  setDoc,
  addDoc,
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
import { getDbInstance } from './firebase-config'

export {
  doc,
  setDoc,
  addDoc,
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

export function getDb() {
  return getDbInstance()
}
