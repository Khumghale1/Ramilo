import { MapPin, Tag } from 'lucide-react'

const risingPlaces = [
  {
    id: 1,
    name: 'Lakeview Bistro',
    location: 'Chabahil',
    priceRange: 'Mid-range',
    quote: '"Gaining fame for sunset cocktails and live acoustic sets."',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  },
  {
    id: 2,
    name: 'Lakeview Bistro',
    location: 'Chabahil',
    priceRange: 'Mid-range',
    quote: '"Gaining fame for sunset cocktails and live acoustic sets."',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  },
  {
    id: 3,
    name: 'Lakeview Bistro',
    location: 'Chabahil',
    priceRange: 'Mid-range',
    quote: '"Gaining fame for sunset cocktails and live acoustic sets."',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  },
]

export default function RisingPlaces() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Rising Places
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {risingPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-xl border border-gray-100 p-3 flex gap-3"
            >
              {/* Thumbnail */}
              <img
                src={place.image}
                alt={place.name}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />

              {/* Content */}
              <div className="flex flex-col justify-center min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#CA4141]" />
                    {place.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag size={12} className="text-[#CA4141]" />
                    {place.priceRange}
                  </span>
                </div>
                <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-3">
                  {place.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
