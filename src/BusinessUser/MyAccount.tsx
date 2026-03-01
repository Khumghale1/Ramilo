import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { User, Mail, Calendar, Edit, Building2, Loader2, Clock, CheckCircle, XCircle } from "lucide-react"
import { getMe, getMySubmissions, type User as UserType, type BusinessSubmission } from "@/lib/api"

export default function MyAccount() {
  const [user, setUser] = useState<UserType | null>(null)
  const [submissions, setSubmissions] = useState<BusinessSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [userData, submissionsData] = await Promise.all([
        getMe(),
        getMySubmissions()
      ])
      setUser(userData)
      setSubmissions(submissionsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load account data")
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

  // Get the primary business (first approved, or first pending, or first submission)
  const approvedBusiness = submissions.find(s => s.status === "APPROVED")
  const pendingBusiness = submissions.find(s => s.status === "PENDING")
  const primaryBusiness = approvedBusiness || pendingBusiness || submissions[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and business details</p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>

        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-[#CA4141]/10 rounded-full flex items-center justify-center flex-shrink-0">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-[#CA4141]" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{user?.name || "Not set"}</p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-gray-700">{user?.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                {user?.role === "BUSINESS_USER" ? "Business Account" : user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Details Card */}
      {primaryBusiness ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Business Details</h2>
            {primaryBusiness.status === "PENDING" && (
              <Link
                to="/business/edit/$id"
                params={{ id: primaryBusiness.id }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#CA4141] hover:bg-[#CA4141]/5 border border-[#CA4141] rounded-lg transition-colors"
              >
                <Edit size={14} />
                Edit Business
              </Link>
            )}
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            {primaryBusiness.status === "PENDING" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                <Clock size={14} />
                Pending Review
              </span>
            )}
            {primaryBusiness.status === "APPROVED" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                <CheckCircle size={14} />
                Approved
              </span>
            )}
            {primaryBusiness.status === "REJECTED" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                <XCircle size={14} />
                Rejected
              </span>
            )}
          </div>

          {/* Rejection Reason */}
          {primaryBusiness.status === "REJECTED" && primaryBusiness.rejectionReason && (
            <div className="mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <p className="text-xs text-red-600">
                <span className="font-medium">Reason:</span> {primaryBusiness.rejectionReason}
              </p>
            </div>
          )}

          {/* Business Cover Photo and Name */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              {primaryBusiness.photos[0] ? (
                <img
                  src={primaryBusiness.photos[0]}
                  alt={primaryBusiness.businessName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{primaryBusiness.businessName}</h3>
              <p className="text-sm text-gray-500">
                {primaryBusiness.category} • {primaryBusiness.area.replace(/_/g, " ")}
              </p>
            </div>
          </div>

          {/* Business Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Contact</p>
              <p className="text-sm text-gray-900">{primaryBusiness.contact}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Price Range</p>
              <p className="text-sm text-gray-900">{primaryBusiness.priceRange}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Crowd Level</p>
              <p className="text-sm text-gray-900">{primaryBusiness.crowdLevel}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Parking</p>
              <p className="text-sm text-gray-900">{primaryBusiness.hasParking ? "Available" : "Not Available"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Alcohol</p>
              <p className="text-sm text-gray-900">{primaryBusiness.alcoholAvailable ? "Served" : "Not Served"}</p>
            </div>

            {primaryBusiness.address && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-900">{primaryBusiness.address}</p>
              </div>
            )}

            {primaryBusiness.website && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Website</p>
                <a
                  href={primaryBusiness.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#CA4141] hover:underline"
                >
                  {primaryBusiness.website}
                </a>
              </div>
            )}

            {primaryBusiness.instagramHandle && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Instagram</p>
                <p className="text-sm text-gray-900">{primaryBusiness.instagramHandle}</p>
              </div>
            )}
          </div>

          {/* Best For Moods */}
          {primaryBusiness.bestForMoods.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Best For</p>
              <div className="flex flex-wrap gap-2">
                {primaryBusiness.bestForMoods.map((mood) => (
                  <span
                    key={mood}
                    className="px-2.5 py-1 bg-[#CA4141]/10 text-[#CA4141] rounded-full text-xs font-medium"
                  >
                    {mood.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Features */}
          {primaryBusiness.specialFeatures && primaryBusiness.specialFeatures.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Special Features</p>
              <div className="flex flex-wrap gap-2">
                {primaryBusiness.specialFeatures.map((feature) => (
                  <span
                    key={feature}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submission Date */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Submitted on {new Date(primaryBusiness.submittedAt).toLocaleDateString()}
              {primaryBusiness.reviewedAt && (
                <> • Reviewed on {new Date(primaryBusiness.reviewedAt).toLocaleDateString()}</>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No business yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Add your business to get started with Ramailo.
          </p>
          <Link
            to="/add-business"
            className="inline-flex items-center gap-2 bg-[#CA4141] hover:bg-[#b33636] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Add Your Business
          </Link>
        </div>
      )}
    </div>
  )
}
