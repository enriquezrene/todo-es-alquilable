import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'
import { ToastProvider } from '@/shared/providers/ToastProvider'

function AllProviders({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}

export function renderConProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}
