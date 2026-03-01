import { createFileRoute } from '@tanstack/react-router'
import EditBusiness from '@/BusinessUser/EditBusiness'
import BusinessLayout from '@/BusinessUser/BusinessLayout'

export const Route = createFileRoute('/business/edit/$id')({
  component: EditBusinessRoute,
})

function EditBusinessRoute() {
  const { id } = Route.useParams()
  return (
    <BusinessLayout>
      <EditBusiness id={id} />
    </BusinessLayout>
  )
}
