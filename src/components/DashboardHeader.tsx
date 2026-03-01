import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, LogOut, User, Settings, Home } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { getMe, type User as UserType } from '@/lib/api'

interface DashboardHeaderProps {
  title: string
  variant?: 'admin' | 'business'
}

export default function DashboardHeader({ title, variant = 'business' }: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    setDropdownOpen(false)
  }

  const bgAccent = variant === 'admin' ? 'bg-purple-600' : 'bg-[#CA4141]'

  return (
    <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b border-gray-200 h-16 items-center justify-between px-8">
      {/* Left side - Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Right side - Actions & User */}
      <div className="flex items-center gap-4">
        {/* Back to main site */}
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Main Site</span>
        </Link>

        {/* User Dropdown */}
        {session?.user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {userProfile?.role === 'ADMIN' ? 'Administrator' : 'Business Owner'}
                </p>
              </div>
              <div className={`w-9 h-9 ${bgAccent} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </p>
                  {userProfile?.role === 'ADMIN' && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                      Administrator
                    </span>
                  )}
                  {userProfile?.role === 'BUSINESS_USER' && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-[#CA4141]/10 text-[#CA4141] text-xs font-medium rounded">
                      Business Owner
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <Link
                    to={variant === 'admin' ? '/admin' : '/business/account'}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    My Account
                  </Link>
                  <Link
                    to={variant === 'admin' ? '/admin' : '/business'}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
