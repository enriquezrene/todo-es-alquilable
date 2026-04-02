/* eslint-disable @next/next/no-img-element */
import type { Usuario } from '@/shared/types/usuario'
import { formatearFecha } from '@/lib/dominio/formatear-fecha'
import WhatsAppButton from '@/features/listings/components/WhatsAppButton'

type ProfileCardProps = {
  usuario: Usuario
  showContact?: boolean
}

export default function ProfileCard({ usuario, showContact = false }: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {usuario.photoURL ? (
            <img src={usuario.photoURL} alt={usuario.displayName} className="h-full w-full rounded-full object-cover" />
          ) : (
            usuario.displayName.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{usuario.displayName}</h3>
          <p className="text-sm text-gray-500">{usuario.province}, {usuario.city}</p>
          <p className="text-xs text-gray-400">Miembro desde {formatearFecha(usuario.createdAt)}</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>{usuario.activeListingCount} anuncios activos</p>
      </div>

      {showContact && usuario.phone && (
        <div className="mt-4">
          <WhatsAppButton ownerId={usuario.uid} listingTitle="" fallbackPhone={usuario.phone} />
        </div>
      )}
    </div>
  )
}
