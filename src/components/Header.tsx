import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, CalendarDays, Plus, User, LogOut, ChevronDown, Building2, Shield, Menu } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { getMe, type User as UserType } from '@/lib/api'
import { useAuthModal } from '@/contexts/AuthModalContext'

export default function Header() {
  const { openLogin, openSignup } = useAuthModal()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const [userProfile, setUserProfile] = useState<UserType | null>(null)

  // Fetch user profile to get role
  useEffect(() => {
    if (session?.user) {
      getMe()
        .then(setUserProfile)
        .catch(() => setUserProfile(null))
    } else {
      setUserProfile(null)
    }
  }, [session?.user])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    setDropdownOpen(false)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900 tracking-wide">
            RAMAILO
          </Link>

          <nav className="flex items-center gap-4 md:gap-6">
            {/* My Saves - hidden on mobile */}
            {session?.user ? (
              <Link
                to="/my-saves"
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <Heart size={18} />
                <span>My Saves</span>
              </Link>
            ) : (
              <button
                onClick={openLogin}
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <Heart size={18} />
                <span>My Saves</span>
              </button>
            )}

            {/* My Plans - hidden on mobile */}
            {session?.user ? (
              <Link
                to="/my-plans"
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <CalendarDays size={18} />
                <span>My Plans</span>
              </Link>
            ) : (
              <button
                onClick={openLogin}
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <CalendarDays size={18} />
                <span>My Plans</span>
              </button>
            )}

            {/* Add Your Business */}
            <Link
              to="/add-business"
              className="flex items-center gap-1.5 md:gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Your Business</span>
              <span className="sm:hidden">Add Business</span>
            </Link>

            {session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#CA4141] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                      {userProfile?.role === 'ADMIN' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                          Admin
                        </span>
                      )}
                      {userProfile?.role === 'BUSINESS_USER' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#CA4141]/10 text-[#CA4141] text-xs font-medium rounded">
                          Business
                        </span>
                      )}
                    </div>
                    {userProfile?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield size={16} />
                        Admin Panel
                      </Link>
                    )}
                    {userProfile?.role === 'BUSINESS_USER' && (
                      <Link
                        to="/business"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Building2 size={16} />
                        My Business
                      </Link>
                    )}
                    <Link
                      to="/"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Desktop: Sign In button */}
                <button
                  onClick={openLogin}
                  className="hidden md:block bg-[#CA4141] hover:bg-[#b33636] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Sign In
                </button>

                {/* Mobile: Hamburger menu */}
                <div className="relative md:hidden" ref={mobileMenuRef}>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Menu size={24} />
                  </button>

                  {mobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          openLogin()
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          openSignup()
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-[#CA4141] hover:bg-gray-50 transition-colors font-medium"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}
