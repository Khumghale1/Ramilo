import { MapPin, Tag, BookmarkPlus, Heart, Loader2, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useSavePlace } from '@/hooks/useSavePlace'
import { usePlanPlace } from '@/hooks/usePlanPlace'
import { type Place } from '@/lib/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Fallback data when API has no places
const fallbackPlaces = [
  {
    id: 'demo-1',
    name: 'Himalayan Java',
    area: 'DURBAR_MARG',
    priceRange: 'MID',
    photos: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80'],
  },
  {
    id: 'demo-2',
    name: 'Roadhouse Cafe',
    area: 'BOUDHA',
    priceRange: 'BUDGET',
    photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'],
  },
  {
    id: 'demo-3',
    name: 'Garden of Dreams Cafe',
    area: 'THAMEL',
    priceRange: 'PREMIUM',
    photos: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80'],
  },
]

export default function TrendingPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const { isSaved, toggleSave, savingId } = useSavePlace()
  const { isPlanned, planVisit, planningId } = usePlanPlace()

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch(`${API_URL}/api/trending`)
        if (res.ok) {
          const data = await res.json()
          const trendingPlaces = data.data?.trending?.map((t: { place: Place }) => t.place) || []
          setPlaces(trendingPlaces.length > 0 ? trendingPlaces : fallbackPlaces as Place[])
        } else {
          setPlaces(fallbackPlaces as Place[])
        }
      } catch {
        setPlaces(fallbackPlaces as Place[])
      } finally {
        setLoading(false)
      }
    }
    fetchTrending()
  }, [])

  async function handleSave(placeId: string) {
    await toggleSave(placeId)
  }

  async function handlePlan(placeId: string) {
    await planVisit(placeId)
  }

  function formatArea(area: string) {
    return area.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  function formatPrice(price: string) {
    const priceMap: Record<string, string> = {
      BUDGET: 'Budget',
      MID: 'Mid-range',
      PREMIUM: 'Premium',
    }
    return priceMap[price] || price
  }

  if (loading) {
    return (
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#CA4141]" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Trending This Week
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image - Clickable to detail page */}
              <Link to="/place/$placeId" params={{ placeId: place.id }} className="block">
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={place.coverPhoto || place.photos?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80'}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSave(place.id)
                    }}
                    disabled={savingId === place.id}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                      isSaved(place.id)
                        ? 'bg-[#CA4141] text-white'
                        : 'bg-white text-gray-400 hover:text-[#CA4141]'
                    }`}
                  >
                    {savingId === place.id ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Heart size={15} className={isSaved(place.id) ? 'fill-white' : ''} />
                    )}
                  </button>
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link to="/place/$placeId" params={{ placeId: place.id }}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-[#CA4141] transition-colors">{place.name}</h3>
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#CA4141]" />
                    {formatArea(place.area)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag size={13} className="text-[#CA4141]" />
                    {formatPrice(place.priceRange)}
                  </span>
                </div>
                <button
                  onClick={() => handlePlan(place.id)}
                  disabled={planningId === place.id}
                  className={`w-full rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    isPlanned(place.id)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-[#CA4141] hover:bg-[#b33737] text-white'
                  }`}
                >
                  {planningId === place.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isPlanned(place.id) ? (
                    <Check size={16} />
                  ) : (
                    <BookmarkPlus size={16} />
                  )}
                  {isPlanned(place.id) ? 'Planned' : 'Planning to Visit'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
