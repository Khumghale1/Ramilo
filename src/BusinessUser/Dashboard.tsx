import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Plus, Clock, CheckCircle, XCircle, Edit, Trash2, Building2, Loader2 } from "lucide-react"
import { getMySubmissions, deleteMySubmission, type BusinessSubmission } from "@/lib/api"

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending Review",
    icon: Clock,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
}

export default function BusinessDashboard() {
  const [submissions, setSubmissions] = useState<BusinessSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadSubmissions()
  }, [])

  async function loadSubmissions() {
    try {
      setLoading(true)
      const data = await getMySubmissions()
      setSubmissions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load submissions")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this submission?")) return

    try {
      setDeleting(id)
      await deleteMySubmission(id)
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setDeleting(null)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Businesses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your business submissions</p>
        </div>
        <Link
          to="/add-business"
          className="flex items-center gap-2 bg-[#CA4141] hover:bg-[#b33636] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Add New Business
        </Link>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Start by adding your first business to get listed on Ramailo.
          </p>
          <Link
            to="/add-business"
            className="inline-flex items-center gap-2 bg-[#CA4141] hover:bg-[#b33636] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={18} />
            Add Your First Business
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => {
            const statusConfig = STATUS_CONFIG[submission.status]
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={submission.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4"
              >
                {/* Cover Photo */}
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {submission.photos[0] ? (
                    <img
                      src={submission.photos[0]}
                      alt={submission.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {submission.businessName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {submission.category} • {submission.area.replace(/_/g, " ")}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}
                    >
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {submission.status === "REJECTED" && submission.rejectionReason && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      <p className="text-xs text-red-600">
                        <span className="font-medium">Reason:</span> {submission.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                    {submission.reviewedAt && (
                      <span>
                        Reviewed: {new Date(submission.reviewedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  {submission.status === "PENDING" && (
                    <div className="flex items-center gap-2 mt-4">
                      <Link
                        to="/business/edit/$id"
                        params={{ id: submission.id }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(submission.id)}
                        disabled={deleting === submission.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleting === submission.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
