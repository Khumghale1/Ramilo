import { createFileRoute, Link } from '@tanstack/react-router'
import { Wallet, ArrowLeft, MapPin, Tag } from 'lucide-react'

export const Route = createFileRoute('/mood/budget-hangout')({
  component: BudgetHangoutPage,
})

const places = [
  { id: 1, name: 'Ama\'s Tea House', location: 'Budhanilkantha', priceRange: 'Budget', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80' },
  { id: 2, name: 'Street Momo Corner', location: 'Asan', priceRange: 'Budget', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80' },
  { id: 3, name: 'Namaste Cafe', location: 'Boudha', priceRange: 'Budget', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80' },
]

function BudgetHangoutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Wallet size={22} className="text-[#CA4141]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Hangout</h1>
            <p className="text-gray-500 text-sm">Affordable fun</p>
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
