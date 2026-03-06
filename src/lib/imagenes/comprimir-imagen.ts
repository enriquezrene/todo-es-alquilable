function redimensionar(
  file: File,
  maxWidth: number,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context not available'))

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
        'image/jpeg',
        quality,
      )
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export function comprimirImagen(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8,
): Promise<Blob> {
  return redimensionar(file, maxWidth, quality)
}

export async function procesarImagen(
  file: File,
): Promise<{ full: Blob; thumbnail: Blob }> {
  const [full, thumbnail] = await Promise.all([
    redimensionar(file, 1200, 0.8),
    redimensionar(file, 400, 0.7),
  ])
  return { full, thumbnail }
}

export function procesarImagenes(
  files: File[],
): Promise<Array<{ full: Blob; thumbnail: Blob }>> {
  return Promise.all(files.map(procesarImagen))
}
