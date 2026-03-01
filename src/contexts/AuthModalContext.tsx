import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { LoginForm } from '@/components/login-form'
import { SignupForm } from '@/components/signup-form'
import { X } from 'lucide-react'

type ModalView = 'login' | 'signup' | null

interface AuthModalContextType {
  openLogin: () => void
  openSignup: () => void
  closeModal: () => void
  isOpen: boolean
}

const AuthModalContext = createContext<AuthModalContextType | null>(null)

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider')
  }
  return context
}

interface AuthModalProviderProps {
  children: ReactNode
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [modal, setModal] = useState<ModalView>(null)

  const openLogin = useCallback(() => setModal('login'), [])
  const openSignup = useCallback(() => setModal('signup'), [])
  const closeModal = useCallback(() => setModal(null), [])

  return (
    <AuthModalContext.Provider
      value={{
        openLogin,
        openSignup,
        closeModal,
        isOpen: modal !== null,
      }}
    >
      {children}

      {/* Auth Modal */}
      {modal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            {modal === 'login' ? (
              <LoginForm
                onSignUpClick={() => setModal('signup')}
                onClose={closeModal}
              />
            ) : (
              <SignupForm
                onSignInClick={() => setModal('login')}
              />
            )}
          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  )
}
