import { createFileRoute } from '@tanstack/react-router'
import AdminUsers from '@/Admin/Users'

export const Route = createFileRoute('/admin/users')({
  component: UsersPage,
})

function UsersPage() {
  return <AdminUsers />
}
