import { createFileRoute, Link } from '@tanstack/react-router'
import { Laptop, ArrowLeft, MapPin, Tag } from 'lucide-react'

export const Route = createFileRoute('/mood/quiet-work')({
  component: QuietWorkPage,
})

const places = [
  { id: 1, name: 'Himalayan Java', location: 'Durbarmarg', priceRange: 'Mid-range', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80' },
  { id: 2, name: 'Keisar Library', location: 'Kantipath', priceRange: 'Budget', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80' },
  { id: 3, name: 'Coffee Break', location: 'Lazimpat', priceRange: 'Budget', image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80' },
]

function QuietWorkPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Laptop size={22} className="text-[#CA4141]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quiet Work</h1>
            <p className="text-gray-500 text-sm">Peaceful focus spots</p>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.map((place) => (
            <div key={place.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="h-44 bg-gray-100">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{place.name}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#CA4141]" />
                    {place.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag size={12} className="text-[#CA4141]" />
                    {place.priceRange}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
