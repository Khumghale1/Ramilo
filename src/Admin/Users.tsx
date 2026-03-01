import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, Users as UsersIcon, Building2, Loader2, Trash2 } from "lucide-react"
import { getAdminUsers, updateUserRole, deleteAdminUser, type AdminUser } from "@/lib/api"

const ROLE_TABS = [
  { label: "All", value: undefined },
  { label: "Users", value: "USER" as const },
  { label: "Business Users", value: "BUSINESS_USER" as const },
]

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"USER" | "BUSINESS_USER" | undefined>(undefined)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [activeTab])

  async function loadUsers() {
    try {
      setLoading(true)
      const data = await getAdminUsers(activeTab)
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId: string, newRole: "USER" | "BUSINESS_USER") {
    try {
      setActionLoading(userId)
      await updateUserRole(userId, newRole)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update role")
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete(userId: string, userName: string) {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return
    }

    try {
      setActionLoading(userId)
      await deleteAdminUser(userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin"
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage users and their roles</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? "border-[#CA4141] text-[#CA4141]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#CA4141]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500 text-sm">
            {activeTab ? `No ${activeTab === "USER" ? "regular" : "business"} users found.` : "No users found."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Submissions</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || "No name"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as "USER" | "BUSINESS_USER")}
                      disabled={actionLoading === user.id}
                      className={`text-sm border rounded-lg px-2 py-1 ${
                        user.role === "BUSINESS_USER"
                          ? "bg-purple-50 border-purple-200 text-purple-700"
                          : "bg-blue-50 border-blue-200 text-blue-700"
                      }`}
                    >
                      <option value="USER">User</option>
                      <option value="BUSINESS_USER">Business User</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {user._count.businessSubmissions > 0 ? (
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Building2 size={14} />
                        {user._count.businessSubmissions}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id, user.name || user.email)}
                      disabled={actionLoading === user.id}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
