import { createFileRoute, Link } from '@tanstack/react-router'
import { Compass, ArrowLeft, MapPin, Wallet, Heart, Loader2, Check, BookmarkPlus } from 'lucide-react'
import { Filter } from '@/components/Filter'
import { useSavePlace } from '@/hooks/useSavePlace'
import { usePlanPlace } from '@/hooks/usePlanPlace'

export const Route = createFileRoute('/mood/tourist-day-out')({
  component: TouristDayOutPage,
})

const places = [
  {
    id: 1,
    name: 'Pashupatinath Temple',
    location: 'Gaushala',
    priceRange: 'Free',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80',
    description: 'One of the most sacred Hindu temples in the world, located on the banks of the Bagmati River. A UNESCO World Heritage Site.',
    tags: ['UNESCO Site', 'Religious', 'Cultural Heritage'],
  },
  {
    id: 2,
    name: 'Boudhanath Stupa',
    location: 'Boudha',
    priceRange: 'Budget',
    image: 'https://images.unsplash.com/photo-1577253313708-cab167d2c474?w=600&q=80',
    description: 'One of the largest spherical stupas in Nepal, surrounded by vibrant Tibetan monasteries and shops.',
    tags: ['UNESCO Site', 'Buddhist', 'Photo Spot'],
  },
  {
    id: 3,
    name: 'Swayambhunath',
    location: 'Swayambhu',
    priceRange: 'Budget',
    image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&q=80',
    description: 'The famous Monkey Temple offering panoramic views of Kathmandu Valley and ancient Buddhist architecture.',
    tags: ['Panoramic View', 'Ancient Site', 'Hiking'],
  },
]

function TouristDayOutPage() {
  const { isSaved, toggleSave, savingId } = useSavePlace()
  const { isPlanned, planVisit, planningId } = usePlanPlace()

  const handleSave = async (id: string) => {
    await toggleSave(id)
  }

  const handlePlan = async (id: string) => {
    await planVisit(id)
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
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <Compass size={20} className="md:hidden text-[#CA4141]" />
              <Compass size={22} className="hidden md:block text-[#CA4141]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tourist Day-Out</h1>
              <p className="text-gray-500 text-xs md:text-sm">Must see local experiences</p>
            </div>
          </div>
          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Filter />
          </div>
        </div>

        {/* Desktop Filter Bar */}
        <div className="hidden md:block mb-8">
          <Filter />
        </div>

        {/* Place Cards */}
        <div className="flex flex-col gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow"
            >
              {/* Image */}
              <Link
                to="/place/$placeId"
                params={{ placeId: String(place.id) }}
                className="w-full md:w-64 h-48 md:h-40 flex-shrink-0 rounded-xl overflow-hidden border-2 border-[#CA4141]/20"
              >
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </Link>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                {/* Title Row */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link
                      to="/place/$placeId"
                      params={{ placeId: String(place.id) }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-[#CA4141] transition-colors">
                        {place.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-[#CA4141]" />
                        {place.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet size={14} className="text-[#CA4141]" />
                        {place.priceRange}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSave(String(place.id))}
                    disabled={savingId === String(place.id)}
                    className={`p-2 rounded-full transition-colors ${
                      isSaved(String(place.id))
                        ? 'bg-[#CA4141] text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {savingId === String(place.id) ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Heart
                        size={20}
                        className={
                          isSaved(String(place.id))
                            ? 'fill-white text-white'
                            : 'text-gray-400'
                        }
                      />
                    )}
                  </button>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {place.description}
                  </p>
                </div>

                {/* Tags and Action */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePlan(String(place.id))}
                    disabled={planningId === String(place.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isPlanned(String(place.id))
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-[#CA4141] hover:bg-[#b33a3a] text-white'
                    }`}
                  >
                    {planningId === String(place.id) ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isPlanned(String(place.id)) ? (
                      <Check size={16} />
                    ) : (
                      <BookmarkPlus size={16} />
                    )}
                    <span>{isPlanned(String(place.id)) ? 'Planned' : 'Planning to Visit'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
