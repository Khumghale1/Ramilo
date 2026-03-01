import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, Clock, CheckCircle, XCircle, Building2, Loader2, Eye, Check, X } from "lucide-react"
import { getAdminSubmissions, approveSubmission, rejectSubmission, type AdminSubmission } from "@/lib/api"
import { Input } from "@/components/ui/input"

const STATUS_TABS = [
  { label: "All", value: undefined },
  { label: "Pending", value: "PENDING" as const },
  { label: "Approved", value: "APPROVED" as const },
  { label: "Rejected", value: "REJECTED" as const },
]

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
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

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED" | undefined>("PENDING")

  // Modal states
  const [selectedSubmission, setSelectedSubmission] = useState<AdminSubmission | null>(null)
  const [modalType, setModalType] = useState<"view" | "approve" | "reject" | null>(null)
  const [password, setPassword] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    loadSubmissions()
  }, [activeTab])

  async function loadSubmissions() {
    try {
      setLoading(true)
      const data = await getAdminSubmissions(activeTab)
      setSubmissions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load submissions")
    } finally {
      setLoading(false)
    }
  }

  function openModal(submission: AdminSubmission, type: "view" | "approve" | "reject") {
    setSelectedSubmission(submission)
    setModalType(type)
    setPassword("")
    setRejectReason("")
    setActionError("")
    setSuccessMessage("")
  }

  function closeModal() {
    setSelectedSubmission(null)
    setModalType(null)
    setPassword("")
    setRejectReason("")
    setActionError("")
    setSuccessMessage("")
  }

  async function handleApprove() {
    if (!selectedSubmission || !password) return

    if (password.length < 6) {
      setActionError("Password must be at least 6 characters")
      return
    }

    try {
      setActionLoading(true)
      setActionError("")
      const result = await approveSubmission(selectedSubmission.id, password)
      setSuccessMessage(`Approved! User email: ${result.userEmail}`)

      // Refresh list after a short delay
      setTimeout(() => {
        closeModal()
        loadSubmissions()
      }, 2000)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to approve")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject() {
    if (!selectedSubmission || !rejectReason) return

    try {
      setActionLoading(true)
      setActionError("")
      await rejectSubmission(selectedSubmission.id, rejectReason)
      closeModal()
      loadSubmissions()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to reject")
    } finally {
      setActionLoading(false)
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
          <h1 className="text-2xl font-bold text-gray-900">Business Submissions</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve business applications</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
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
      ) : submissions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions</h3>
          <p className="text-gray-500 text-sm">
            {activeTab ? `No ${activeTab.toLowerCase()} submissions found.` : "No submissions found."}
          </p>
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
                {/* Photo */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {submission.photos[0] ? (
                    <img
                      src={submission.photos[0]}
                      alt={submission.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{submission.businessName}</h3>
                      <p className="text-sm text-gray-500">
                        {submission.category} • {submission.area.replace(/_/g, " ")}
                      </p>
                      {submission.user && (
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted by: {submission.user.email}
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}
                    >
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Contact */}
                  <p className="text-sm text-gray-600 mt-2">Contact: {submission.contact}</p>

                  {/* Meta */}
                  <p className="text-xs text-gray-400 mt-2">
                    Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => openModal(submission, "view")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    {submission.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => openModal(submission, "approve")}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => openModal(submission, "reject")}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {selectedSubmission && modalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* View Modal */}
            {modalType === "view" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedSubmission.businessName}</h2>

                {/* Photos */}
                {selectedSubmission.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {selectedSubmission.photos.slice(0, 6).map((photo, i) => (
                      <img key={i} src={photo} alt="" className="w-full h-20 object-cover rounded-lg" />
                    ))}
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div><span className="font-medium">Category:</span> {selectedSubmission.category}</div>
                  <div><span className="font-medium">Area:</span> {selectedSubmission.area.replace(/_/g, " ")}</div>
                  <div><span className="font-medium">Contact:</span> {selectedSubmission.contact}</div>
                  <div><span className="font-medium">Price Range:</span> {selectedSubmission.priceRange}</div>
                  <div><span className="font-medium">Crowd Level:</span> {selectedSubmission.crowdLevel}</div>
                  <div><span className="font-medium">Parking:</span> {selectedSubmission.hasParking ? "Yes" : "No"}</div>
                  <div><span className="font-medium">Alcohol:</span> {selectedSubmission.alcoholAvailable ? "Yes" : "No"}</div>
                  <div><span className="font-medium">Best For:</span> {selectedSubmission.bestForMoods.join(", ")}</div>
                  {selectedSubmission.website && <div><span className="font-medium">Website:</span> {selectedSubmission.website}</div>}
                  {selectedSubmission.instagramHandle && <div><span className="font-medium">Instagram:</span> {selectedSubmission.instagramHandle}</div>}
                </div>

                <button
                  onClick={closeModal}
                  className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {/* Approve Modal */}
            {modalType === "approve" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Approve Business</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Set a password for <strong>{selectedSubmission.businessName}</strong>. The business user will use this to login.
                </p>

                {successMessage ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                    {successMessage}
                  </div>
                ) : (
                  <>
                    {actionError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {actionError}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                          Email (auto-generated if not provided)
                        </label>
                        <Input
                          value={selectedSubmission.user?.email || selectedSubmission.contact}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                          Password for Business User <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password (min 6 characters)"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={closeModal}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={actionLoading || !password}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {actionLoading && <Loader2 size={16} className="animate-spin" />}
                        Approve
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Reject Modal */}
            {modalType === "reject" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Reject Submission</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Provide a reason for rejecting <strong>{selectedSubmission.businessName}</strong>.
                </p>

                {actionError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    {actionError}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CA4141]/30 focus:border-[#CA4141]"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading || !rejectReason}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading && <Loader2 size={16} className="animate-spin" />}
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
