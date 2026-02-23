import { MapPin, Tag, BookmarkPlus, Heart } from 'lucide-react'

const trendingPlaces = [
  {
    id: 1,
    name: 'Himalayan Java',
    location: 'Durbarmarg',
    priceRange: 'Mid-range',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
  },
  {
    id: 2,
    name: 'Roadhouse Cafe',
    location: 'Boudha',
    priceRange: 'Budget',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  },
  {
    id: 3,
    name: 'Himalayan Java',
    location: 'Durbarmarg',
    priceRange: 'Premium',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80',
  },
]

export default function TrendingPage() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Trending This Week
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Heart size={15} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{place.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#CA4141]" />
                    {place.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag size={13} className="text-[#CA4141]" />
                    {place.priceRange}
                  </span>
                </div>
                <button className="w-full bg-[#CA4141] hover:bg-[#b33737] text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  <BookmarkPlus size={16} />
                  Planning to Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
