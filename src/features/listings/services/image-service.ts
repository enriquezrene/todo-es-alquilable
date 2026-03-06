import { subirArchivo, eliminarArchivo } from '@/lib/firebase/firebase-storage'

export async function subirImagenesComprimidas(
  listingId: string,
  processed: Array<{ full: Blob; thumbnail: Blob }>,
  startIndex: number = 0,
): Promise<{ imageUrls: string[]; thumbnailUrls: string[] }> {
  const uploads = processed.flatMap(({ full, thumbnail }, index) => [
    subirArchivo(`listings/${listingId}/${startIndex + index}.jpg`, full),
    subirArchivo(`listings/${listingId}/thumbnails/${startIndex + index}.jpg`, thumbnail),
  ])

  const urls = await Promise.all(uploads)

  const imageUrls: string[] = []
  const thumbnailUrls: string[] = []
  for (let i = 0; i < urls.length; i += 2) {
    imageUrls.push(urls[i])
    thumbnailUrls.push(urls[i + 1])
  }

  return { imageUrls, thumbnailUrls }
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
