import { createFileRoute } from '@tanstack/react-router'
import Features from '../components/features'
import TrendingPage from '@/components/TrendingPage'
import RisingPlaces from '@/components/RisingPlaces'
import HiddenGems from '@/components/HiddenGems'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-white">
      
      <Features />
      <TrendingPage/>
      <RisingPlaces/>
      <HiddenGems/>
    </div>
  )
}
