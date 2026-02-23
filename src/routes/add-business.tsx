import { createFileRoute } from '@tanstack/react-router'
import AddBusinessPage from '@/Pages/Addbusinesspage'

export const Route = createFileRoute('/add-business')({
  component: AddBusinessPage,
})
