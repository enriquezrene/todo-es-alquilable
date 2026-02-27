import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getStorageInstance } from './firebase-config'

export async function subirArchivo(path: string, file: File): Promise<string> {
  const storageRef = ref(getStorageInstance(), path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function eliminarArchivo(path: string): Promise<void> {
  const storageRef = ref(getStorageInstance(), path)
  return deleteObject(storageRef)
}

export async function obtenerUrlDescarga(path: string): Promise<string> {
  const storageRef = ref(getStorageInstance(), path)
  return getDownloadURL(storageRef)
}
