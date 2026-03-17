'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { obtenerAnuncioPorId, actualizarAnuncio } from '@/features/listings/services/listing-service'
import type { Anuncio } from '@/shared/types/anuncio'
import Button from '@/shared/components/ui/Button'

export default function DebugAnuncioPage() {
  const params = useParams()
  const id = params.id as string
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fixing, setFixing] = useState(false)

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerAnuncioPorId(id)
        setAnuncio(data)
        console.log('Full anuncio data:', data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
        console.error('Error loading anuncio:', e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id])

  const fixPhoneNumber = async () => {
    if (!anuncio) return
    
    setFixing(true)
    try {
      // Use the phone number you mentioned from Firebase
      const phoneNumber = '+593984480573'
      
      await actualizarAnuncio(id, {
        ownerPhone: phoneNumber
      })
      
      // Refresh the data
      const updated = await obtenerAnuncioPorId(id)
      setAnuncio(updated)
      
      console.log('Fixed phone number!')
    } catch (e) {
      console.error('Error fixing phone:', e)
    } finally {
      setFixing(false)
    }
  }

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!anuncio) {
    return <div>Anuncio not found</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Anuncio: {id}</h1>
      
      <div style={{ background: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
        <h2>All Fields:</h2>
        <pre>{JSON.stringify(anuncio, null, 2)}</pre>
      </div>

      <div style={{ background: '#fff3cd', padding: '10px', marginBottom: '20px' }}>
        <h2>Phone Related Fields:</h2>
        <p><strong>ownerPhone:</strong> &quot;{anuncio.ownerPhone}&quot;</p>
        <p><strong>ownerPhone type:</strong> {typeof anuncio.ownerPhone}</p>
        <p><strong>ownerPhone length:</strong> {anuncio.ownerPhone?.length || 0}</p>
        <p><strong>ownerPhone trimmed:</strong> &quot;{anuncio.ownerPhone?.trim()}&quot;</p>
        <p><strong>ownerPhone truthy:</strong> {!!anuncio.ownerPhone}</p>
        
        {!anuncio.ownerPhone && (
          <div style={{ marginTop: '10px' }}>
            <Button onClick={fixPhoneNumber} loading={fixing}>
              Fix Phone Number (+593984480573)
            </Button>
          </div>
        )}
      </div>

      <div style={{ background: '#d4edda', padding: '10px' }}>
        <h2>Owner Info:</h2>
        <p><strong>ownerId:</strong> {anuncio.ownerId}</p>
        <p><strong>ownerName:</strong> {anuncio.ownerName}</p>
        <p><strong>ownerPhotoURL:</strong> {anuncio.ownerPhotoURL || 'null'}</p>
      </div>
    </div>
  )
}
