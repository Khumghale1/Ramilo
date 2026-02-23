import { useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

const Businesspage = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: '/' })
        },
        onError: (ctx) => {
          console.error('Logout failed:', ctx.error)
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Business Page</h1>
        <button
          onClick={handleLogout}
          className="bg-[#CA4141] hover:bg-[#b33636] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Businesspage
