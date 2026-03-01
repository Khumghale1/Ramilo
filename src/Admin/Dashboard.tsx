import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Users, Building2, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { getAdminStats, type AdminStats } from "@/lib/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      setLoading(true)
      const data = await getAdminStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#CA4141]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.businessUsers || 0}</p>
              <p className="text-sm text-gray-500">Business Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingSubmissions || 0}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.approvedSubmissions || 0}</p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/submissions"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#CA4141] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#CA4141]">
                Business Submissions
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Review and approve business applications
              </p>
            </div>
            {stats?.pendingSubmissions ? (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                {stats.pendingSubmissions} pending
              </span>
            ) : null}
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#CA4141] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#CA4141]">
                User Management
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage users and their roles
              </p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {(stats?.totalUsers || 0) + (stats?.businessUsers || 0)} users
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
