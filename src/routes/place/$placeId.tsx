import { createFileRoute } from '@tanstack/react-router'
import DetailViewPage from '@/Pages/DetailViewpage'

export const Route = createFileRoute('/place/$placeId')({
  component: PlaceDetailRoute,
})

function PlaceDetailRoute() {
  const { placeId } = Route.useParams()
  return <DetailViewPage placeId={placeId} />
}
