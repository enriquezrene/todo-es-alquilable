import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase-config'

export async function subirArchivo(path: string, file: File): Promise<string> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function eliminarArchivo(path: string): Promise<void> {
  const storageRef = ref(storage, path)
  return deleteObject(storageRef)
}

export async function obtenerUrlDescarga(path: string): Promise<string> {
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}
