'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin/pendientes', label: 'Pendientes', icon: '📋' },
  { href: '/admin/aprobados', label: 'Aprobados', icon: '✅' },
  { href: '/admin/categorias', label: 'Categorías', icon: '📁' },
  { href: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { href: '/admin/reportes', label: 'Reportes', icon: '🚨' },
  { href: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Panel Admin</h2>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
