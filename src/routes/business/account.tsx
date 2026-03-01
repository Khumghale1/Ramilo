import { createFileRoute } from '@tanstack/react-router'
import MyAccount from '@/BusinessUser/MyAccount'
import BusinessLayout from '@/BusinessUser/BusinessLayout'

export const Route = createFileRoute('/business/account')({
  component: AccountPage,
})

function AccountPage() {
  return (
    <BusinessLayout>
      <MyAccount />
    </BusinessLayout>
  )
}
