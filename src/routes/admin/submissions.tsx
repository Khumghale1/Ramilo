import { createFileRoute } from '@tanstack/react-router'
import AdminSubmissions from '@/Admin/Submissions'

export const Route = createFileRoute('/admin/submissions')({
  component: SubmissionsPage,
})

function SubmissionsPage() {
  return <AdminSubmissions />
}
