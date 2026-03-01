import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CalendarDays, Trash2, MapPin, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getPlannedVisits, removePlan, type PlannedVisit } from '@/lib/api'
import { useSession } from '@/lib/auth-client'

export const Route = createFileRoute('/my-plans')({
  component: MyPlansPage,
})

function MyPlansPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const navigate = useNavigate()
  const [plans, setPlans] = useState<PlannedVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (sessionLoading) return
    if (!session?.user) {
      navigate({ to: '/' })
      return
    }
    fetchPlans()
  }, [session, sessionLoading, navigate])

  async function fetchPlans() {
    try {
      setLoading(true)
      const data = await getPlannedVisits()
      setPlans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plans')
    } finally {
      setLoading(false)
    }
  }

  async function removeFromPlans(planId: string) {
    setRemovingId(planId)
    try {
      await removePlan(planId)
      setPlans((prev) => prev.filter((p) => p.id !== planId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove plan')
    } finally {
      setRemovingId(null)
    }
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return 'No date set'
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#CA4141]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Travel Plans</h1>
          <p className="text-gray-500 mt-1">
            You have {plans.length} places planned
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Place Cards List */}
        <div className="flex flex-col gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow"
            >
              {/* Image */}
              <div className="w-48 h-28 flex-shrink-0 rounded-xl overflow-hidden">
                <img
                  src={plan.place.coverPhoto || plan.place.photos?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80'}
                  alt={plan.place.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.place.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} className="text-gray-400" />
                  {plan.place.area.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-2">
                  <CalendarDays size={14} className="text-[#CA4141]" />
                  {formatDate(plan.plannedDate)}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeFromPlans(plan.id)}
                disabled={removingId === plan.id}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-60"
              >
                {removingId === plan.id ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Trash2 size={20} />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {plans.length === 0 && (
          <div className="text-center py-16">
            <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No travel plans yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start planning your visits to your favorite places!
            </p>
            <Link
              to="/my-saves"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#CA4141] text-white text-sm font-medium rounded-lg hover:bg-[#b33a3a] transition-colors"
            >
              View Saved Places
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
