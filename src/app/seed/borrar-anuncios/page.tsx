'use client'

import { useState, useCallback } from 'react'
import { collection, getDocs, deleteDoc, doc, getDb } from '@/lib/firebase/firebase-firestore'

type LogEntry = {
  message: string
  type: 'info' | 'success' | 'error'
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function BorrarAnunciosPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs((prev) => [...prev, { message, type }])
  }, [])

  const borrarTodo = useCallback(async () => {
    setIsRunning(true)
    setLogs([])
    setIsDone(false)

    const db = getDb()

    addLog('Obteniendo todos los anuncios...')
    try {
      const snapshot = await getDocs(collection(db, 'listings'))
      addLog(`Encontrados ${snapshot.size} anuncios. Eliminando...`)

      let deleted = 0
      let failed = 0

      for (const docSnap of snapshot.docs) {
        try {
          await deleteDoc(doc(db, 'listings', docSnap.id))
          deleted++
        } catch(e) {
          console.log(e)
          failed++
        }
        await delay(50)
      }

      addLog(`${deleted} anuncios eliminados`, 'success')
      if (failed > 0) {
        addLog(`${failed} anuncios no se pudieron eliminar`, 'error')
      }
    } catch (error: unknown) {
      const firebaseError = error as { message?: string }
      addLog(`Error: ${firebaseError.message}`, 'error')
    }

    setIsDone(true)
    setIsRunning(false)
  }, [addLog])

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Borrar todos los anuncios</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Elimina todos los anuncios de Firestore. Las categorias, usuarios y demas datos no se tocan.
      </p>

      <button
        onClick={borrarTodo}
        disabled={isRunning}
        style={{
          padding: '12px 24px',
          fontSize: 16,
          fontWeight: 600,
          color: '#fff',
          backgroundColor: isRunning ? '#999' : '#dc2626',
          border: 'none',
          borderRadius: 8,
          cursor: isRunning ? 'not-allowed' : 'pointer',
          marginBottom: 24,
        }}
      >
        {isRunning ? 'Eliminando...' : isDone ? 'Ejecutar de nuevo' : 'Borrar todos los anuncios'}
      </button>

      {logs.length > 0 && (
        <div
          style={{
            backgroundColor: '#111',
            color: '#eee',
            borderRadius: 8,
            padding: 16,
            maxHeight: 500,
            overflowY: 'auto',
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'monospace',
          }}
        >
          {logs.map((log, i) => (
            <div
              key={i}
              style={{
                color:
                  log.type === 'success'
                    ? '#4ade80'
                    : log.type === 'error'
                      ? '#f87171'
                      : '#94a3b8',
              }}
            >
              {log.type === 'success' ? '[OK] ' : log.type === 'error' ? '[ERROR] ' : '[...] '}
              {log.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
