'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

type Toast = {
  id: string
  message: string
  type: ToastType
}

type ToastContextValue = {
  toasts: Toast[]
  mostrarToast: (message: string, type?: ToastType) => void
  eliminarToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toastColors: Record<ToastType, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500 text-black',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const eliminarToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const mostrarToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Date.now().toString()
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => eliminarToast(id), 4000)
    },
    [eliminarToast],
  )

  return (
    <ToastContext.Provider value={{ toasts, mostrarToast, eliminarToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toastColors[toast.type]}`}
            role="alert"
          >
            <div className="flex items-center justify-between gap-3">
              <span>{toast.message}</span>
              <button
                onClick={() => eliminarToast(toast.id)}
                className="text-white/80 hover:text-white"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider')
  }
  return context
}
