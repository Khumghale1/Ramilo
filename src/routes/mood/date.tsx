import { createFileRoute, Link } from '@tanstack/react-router'
import { Heart, ArrowLeft, MapPin, Tag } from 'lucide-react'

export const Route = createFileRoute('/mood/date')({
  component: DatePage,
})

const places = [
  { id: 1, name: 'Dwarika\'s Hotel', location: 'Battisputali', priceRange: 'Premium', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80' },
  { id: 2, name: 'The Garden of Dreams', location: 'Kaisermahal', priceRange: 'Mid-range', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80' },
  { id: 3, name: 'Bhojan Griha', location: 'Dillibazar', priceRange: 'Mid-range', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80' },
]

function DatePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Heart size={22} className="text-[#CA4141]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Date</h1>
            <p className="text-gray-500 text-sm">Perfect for romantic moments</p>
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
