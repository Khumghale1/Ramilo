import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router'
import AdminDashboard from '@/Admin/Dashboard'
import AdminLayout from '@/Admin/AdminLayout'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const matches = useMatches()
  // Check if we're on the exact /admin route (no child routes active)
  const isExactAdminRoute = matches[matches.length - 1]?.routeId === '/admin'

  return (
    <AdminLayout>
      {isExactAdminRoute ? <AdminDashboard /> : <Outlet />}
    </AdminLayout>
  )
}
