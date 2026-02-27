import EmptyState from '@/shared/components/feedback/EmptyState'

export default function ReportesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Reportes</h1>
      <EmptyState
        title="Próximamente"
        description="El sistema de reportes estará disponible en una próxima versión."
      />
    </div>
  )
}
