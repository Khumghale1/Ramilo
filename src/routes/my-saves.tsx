import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Heart, MapPin, Wallet, CalendarDays, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSavedPlaces, unsavePlace, addPlan, type SavedPlace } from '@/lib/api'
import { useSession } from '@/lib/auth-client'

export const Route = createFileRoute('/my-saves')({
  component: MySavesPage,
})

function MySavesPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const navigate = useNavigate()
  const [places, setPlaces] = useState<SavedPlace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [planningId, setPlanningId] = useState<string | null>(null)

  useEffect(() => {
    if (sessionLoading) return
    if (!session?.user) {
      navigate({ to: '/' })
      return
    }
    fetchSavedPlaces()
  }, [session, sessionLoading, navigate])

  async function fetchSavedPlaces() {
    try {
      setLoading(true)
      const data = await getSavedPlaces()
      setPlaces(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load saved places')
    } finally {
      setLoading(false)
    }
  }

  async function removeFromSaves(placeId: string) {
    setRemovingId(placeId)
    try {
      await unsavePlace(placeId)
      setPlaces((prev) => prev.filter((p) => p.placeId !== placeId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove')
    } finally {
      setRemovingId(null)
    }
  }

  async function handlePlanToVisit(placeId: string) {
    setPlanningId(placeId)
    try {
      await addPlan(placeId)
      // Optionally show success message or navigate to plans
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to plans')
    } finally {
      setPlanningId(null)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">My Saves</h1>
          <p className="text-gray-500 mt-1">
            You have saved {places.length} places
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Place Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((saved) => (
            <div
              key={saved.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-52">
                <img
                  src={saved.place.coverPhoto || saved.place.photos?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80'}
                  alt={saved.place.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromSaves(saved.placeId)}
                  disabled={removingId === saved.placeId}
                  className="absolute top-3 right-3 w-10 h-10 bg-[#CA4141] rounded-full flex items-center justify-center hover:bg-[#b33a3a] transition-colors disabled:opacity-60"
                >
                  {removingId === saved.placeId ? (
                    <Loader2 size={18} className="text-white animate-spin" />
                  ) : (
                    <Heart size={18} className="text-white fill-white" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {saved.place.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#CA4141]" />
                    {saved.place.area.replace(/_/g, ' ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet size={14} className="text-[#CA4141]" />
                    {saved.place.priceRange}
                  </span>
                </div>

                <button
                  onClick={() => handlePlanToVisit(saved.placeId)}
                  disabled={planningId === saved.placeId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#CA4141] text-white text-sm font-medium rounded-lg hover:bg-[#b33a3a] transition-colors disabled:opacity-60"
                >
                  {planningId === saved.placeId ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CalendarDays size={16} />
                  )}
                  <span>Planning to Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {places.length === 0 && (
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No saved places yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start exploring and save places you love!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#CA4141] text-white text-sm font-medium rounded-lg hover:bg-[#b33a3a] transition-colors"
            >
              Explore Places
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
