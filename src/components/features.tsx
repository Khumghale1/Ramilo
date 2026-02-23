import { Link } from '@tanstack/react-router'
import { Heart, Coffee, UtensilsCrossed, Laptop, Wallet, Compass } from 'lucide-react'

const moods = [
  {
    id: 'date',
    title: 'Date',
    description: 'Perfect for romantic moments',
    icon: Heart,
    path: '/mood/date',
  },
  {
    id: 'coffee-guff',
    title: 'Coffee & Guff',
    description: 'Casual hangouts with friends',
    icon: Coffee,
    path: '/mood/coffee-guff',
  },
  {
    id: 'family-dinner',
    title: 'Family Dinner',
    description: 'Quality time with loved ones',
    icon: UtensilsCrossed,
    path: '/mood/family-dinner',
  },
  {
    id: 'quiet-work',
    title: 'Quiet Work',
    description: 'Peaceful focus spots',
    icon: Laptop,
    path: '/mood/quiet-work',
  },
  {
    id: 'budget-hangout',
    title: 'Budget Hangout',
    description: 'Affordable fun',
    icon: Wallet,
    path: '/mood/budget-hangout',
  },
  {
    id: 'tourist-day-out',
    title: 'Tourist Day-Out',
    description: 'Must see local experiences',
    icon: Compass,
    path: '/mood/tourist-day-out',
  },
]

export default function Features() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What's your mood today?
        </h2>
        <p className="text-gray-500 mb-8">
          Discover local places in Kathmandu Valley based on what you're feeling.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moods.map((mood) => {
            const Icon = mood.icon
            return (
              <Link
                key={mood.id}
                to={mood.path}
                className="border border-gray-100 hover:bg-gray-100 rounded-xl p-6 transition-colors group"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#CA4141]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{mood.title}</h3>
                <p className="text-sm text-gray-500">{mood.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
