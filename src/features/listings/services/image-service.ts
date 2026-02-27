import { subirArchivo, eliminarArchivo } from '@/lib/firebase/firebase-storage'

export async function subirImagenAnuncio(
  listingId: string,
  file: File,
  index: number,
): Promise<string> {
  const extension = file.name.split('.').pop() || 'jpg'
  const path = `listings/${listingId}/${index}.${extension}`
  return subirArchivo(path, file)
}

export async function subirImagenesAnuncio(
  listingId: string,
  files: File[],
): Promise<string[]> {
  const urls = await Promise.all(
    files.map((file, index) => subirImagenAnuncio(listingId, file, index)),
  )
  return urls
}

export async function eliminarImagenAnuncio(
  listingId: string,
  index: number,
  extension: string = 'jpg',
): Promise<void> {
  const path = `listings/${listingId}/${index}.${extension}`
  return eliminarArchivo(path)
}

export async function subirFotoPerfil(uid: string, file: File): Promise<string> {
  const extension = file.name.split('.').pop() || 'jpg'
  const path = `avatars/${uid}/profile.${extension}`
  return subirArchivo(path, file)
}
