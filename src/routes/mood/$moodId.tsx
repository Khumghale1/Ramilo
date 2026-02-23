import { createFileRoute } from '@tanstack/react-router'
import { Heart, Coffee, UtensilsCrossed, Laptop, Wallet, Compass } from 'lucide-react'

const moodData: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  date: {
    title: 'Date',
    description: 'Perfect for romantic moments',
    icon: Heart,
  },
  'coffee-guff': {
    title: 'Coffee & Guff',
    description: 'Casual hangouts with friends',
    icon: Coffee,
  },
  'family-dinner': {
    title: 'Family Dinner',
    description: 'Quality time with loved ones',
    icon: UtensilsCrossed,
  },
  'quiet-work': {
    title: 'Quiet Work',
    description: 'Peaceful focus spots',
    icon: Laptop,
  },
  'budget-hangout': {
    title: 'Budget Hangout',
    description: 'Affordable fun',
    icon: Wallet,
  },
  'tourist-day-out': {
    title: 'Tourist Day-Out',
    description: 'Must see local experiences',
    icon: Compass,
  },
}

export const Route = createFileRoute('/mood/$moodId')({
  component: MoodPage,
})

function MoodPage() {
  const { moodId } = Route.useParams()
  const mood = moodData[moodId] as (typeof moodData)[string] | undefined

  if (!mood) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Mood not found</p>
      </div>
    )
  }

  const Icon = mood.icon

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mood.title}</h1>
            <p className="text-gray-500">{mood.description}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500">Places for {mood.title} will be listed here.</p>
        </div>
      </div>
    </div>
  )
}
