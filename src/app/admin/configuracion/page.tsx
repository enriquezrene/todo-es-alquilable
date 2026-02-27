import EmptyState from '@/shared/components/feedback/EmptyState'

export default function ConfiguracionPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Configuración</h1>
      <EmptyState
        title="Próximamente"
        description="La configuración de la plataforma estará disponible en una próxima versión."
      />
    </div>
  )
}
