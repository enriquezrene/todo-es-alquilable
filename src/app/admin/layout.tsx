import AuthGuard from '@/features/auth/components/AuthGuard'
import AdminSidebar from '@/features/admin/components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="moderator">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <div className="flex-1 p-6">{children}</div>
      </div>
    </AuthGuard>
  )
}
