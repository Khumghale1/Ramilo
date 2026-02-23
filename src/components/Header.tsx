import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, CalendarDays, Plus, X } from 'lucide-react'
import { LoginForm } from '@/components/login-form'
import { SignupForm } from '@/components/signup-form'

type ModalView = 'login' | 'signup' | null

export default function Header() {
  const [modal, setModal] = useState<ModalView>(null)

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900 tracking-wide">
            RAMAILO
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <Heart size={18} />
              <span>My Saves</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <CalendarDays size={18} />
              <span>My Plans</span>
            </Link>

            <Link
              to="/add-business"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <Plus size={18} />
              <span>Add Your Business</span>
            </Link>

            <button
              onClick={() => setModal('login')}
              className="bg-[#CA4141] hover:bg-[#b33636] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {modal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(null)}
              className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            {modal === 'login' ? (
              <LoginForm
                onSignUpClick={() => setModal('signup')}
                onClose={() => setModal(null)}
              />
            ) : (
              <SignupForm
                onSignInClick={() => setModal('login')}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
