import {
  ArrowLeft,
  MapPin,
  Share2,
  Heart,
  Calendar,
  Wallet,
  ParkingCircle,
  Users,
  Wine,
  Sun,
  Phone,
  Instagram,
  Globe,
  Clock,
  Coffee,
  Laptop,
  Navigation,
  Maximize2,
  Loader2,
  Check,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getPlaceById, type Place } from '@/lib/api'
import { useSavePlace } from '@/hooks/useSavePlace'
import { usePlanPlace } from '@/hooks/usePlanPlace'

interface DetailViewPageProps {
  placeId: string
}

interface PlaceDetail extends Place {
  description?: string
  perfectFor?: { name: string; icon: React.ElementType }[]
  highlights?: string[]
  openingHours?: string
  ambience?: string
}

// Mock data fallback
const mockPlaceData: Record<string, PlaceDetail> = {
  'demo-1': {
    id: 'demo-1',
    name: 'Himalayan Java',
    category: 'Cafe',
    area: 'DURBAR_MARG',
    priceRange: 'MID',
    hasParking: true,
    crowdLevel: 'Moderate',
    alcoholAvailable: false,
    photos: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80'],
    description: 'Himalayan Java offers a cozy atmosphere with premium coffee and light snacks, perfect for work or casual meetups.',
    perfectFor: [
      { name: 'Coffee & Guff', icon: Coffee },
      { name: 'Quiet Work', icon: Laptop },
    ],
    highlights: ['WiFi', 'AC', 'Power Outlets'],
    contactPhone: '9801234567',
    instagramHandle: '@himalayanjava',
    website: 'himalayanjava.com',
    openingHours: '7:00 AM - 9:00 PM',
    ambience: 'Indoor',
  },
  'demo-2': {
    id: 'demo-2',
    name: 'Roadhouse Cafe',
    category: 'Restaurant',
    area: 'BOUDHA',
    priceRange: 'BUDGET',
    hasParking: false,
    crowdLevel: 'High',
    alcoholAvailable: true,
    photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'],
    description: 'A lively spot known for its wood-fired pizzas and vibrant atmosphere.',
    perfectFor: [
      { name: 'Date', icon: Heart },
      { name: 'Coffee & Guff', icon: Coffee },
    ],
    highlights: ['Live Music', 'Outdoor Seating', 'Pet Friendly'],
    contactPhone: '9807654321',
    instagramHandle: '@roadhousecafe',
    website: 'roadhousecafe.com.np',
    openingHours: '11:00 AM - 11:00 PM',
    ambience: 'Outdoor',
  },
  'demo-3': {
    id: 'demo-3',
    name: 'Garden of Dreams Cafe',
    category: 'Cafe',
    area: 'THAMEL',
    priceRange: 'PREMIUM',
    hasParking: true,
    crowdLevel: 'Low',
    alcoholAvailable: false,
    photos: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80'],
    description: 'An oasis of calm in the heart of the city, offering premium teas and pastries in a beautiful garden setting.',
    perfectFor: [
      { name: 'Date', icon: Heart },
      { name: 'Quiet Work', icon: Laptop },
    ],
    highlights: ['Garden View', 'WiFi', 'Kid-friendly'],
    contactPhone: '9812345678',
    instagramHandle: '@gardenofdreamscafe',
    website: 'gardenofdreams.com.np',
    openingHours: '9:00 AM - 6:00 PM',
    ambience: 'Outdoor',
  },
}

const defaultPlace: PlaceDetail = {
  id: '1',
  name: 'Lakeview Bistro',
  category: 'Cafe',
  area: 'Chabahil',
  priceRange: 'Budget',
  hasParking: false,
  crowdLevel: 'Moderate',
  alcoholAvailable: false,
  photos: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80'],
  description: 'Lakeview Restro features a relaxed cafe feel during the day, with specialty coffees, light bites, and plenty of space to catch up with friends.',
  perfectFor: [
    { name: 'Date', icon: Heart },
    { name: 'Coffee & Guff', icon: Coffee },
    { name: 'Quiet Work', icon: Laptop },
  ],
  highlights: ['WiFi', 'Outdoor', 'Kid-friendly'],
  contactPhone: '9801526788',
  instagramHandle: '@himalayancafe',
  website: 'himalayancafe.com',
  openingHours: '10:00 AM - 10:00 PM',
  ambience: 'Outdoor',
  latitude: 27.7172,
  longitude: 85.324,
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

export default function DetailViewPage({ placeId }: DetailViewPageProps) {
  const [place, setPlace] = useState<PlaceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const { isSaved, toggleSave, savingId } = useSavePlace()
  const { isPlanned, planVisit, planningId } = usePlanPlace()

  const handleSave = async () => {
    await toggleSave(placeId)
  }

  const handlePlan = async () => {
    await planVisit(placeId)
  }

  useEffect(() => {
    async function fetchPlace() {
      setLoading(true)
      try {
        // Try to fetch from API
        const data = await getPlaceById(placeId)
        setPlace({
          ...data,
          description: `${data.name} is a wonderful ${data.category?.toLowerCase() || 'place'} located in ${formatArea(data.area)}.`,
          perfectFor: [
            { name: 'Coffee & Guff', icon: Coffee },
            { name: 'Quiet Work', icon: Laptop },
          ],
          highlights: data.hasParking ? ['Parking', 'WiFi'] : ['WiFi'],
          openingHours: '9:00 AM - 9:00 PM',
          ambience: 'Indoor',
        })
      } catch {
        // Use mock data if API fails
        const mockPlace = mockPlaceData[placeId]
        if (mockPlace) {
          setPlace(mockPlace)
        } else {
          setPlace({ ...defaultPlace, id: placeId })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPlace()
  }, [placeId])

  const openGoogleMaps = () => {
    if (place?.latitude && place?.longitude) {
      window.open(
        `https://www.google.com/maps?q=${place.latitude},${place.longitude}`,
        '_blank'
      )
    } else if (place?.area) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatArea(place.area) + ', Kathmandu')}`,
        '_blank'
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#CA4141]" />
      </div>
    )
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto py-8 px-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <p className="text-gray-500 text-center py-12">Place not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-4 md:py-8 px-4 md:px-6">
        {/* Back Button - Desktop only */}
        <button
          onClick={() => window.history.back()}
          className="hidden md:inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Hero Image */}
        <div className="relative w-full h-[280px] md:h-[480px] rounded-2xl overflow-hidden mb-4 md:mb-8">
          <img
            src={place.coverPhoto || place.photos?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80'}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          {/* Save button - Mobile */}
          <button
            onClick={handleSave}
            disabled={savingId === placeId}
            className={`absolute top-3 right-3 md:hidden p-2.5 rounded-full shadow-sm transition-colors ${
              isSaved(placeId)
                ? 'bg-[#CA4141] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {savingId === placeId ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Heart size={20} className={isSaved(placeId) ? 'fill-white' : ''} />
            )}
          </button>
          {/* Expand/Gallery button */}
          <button className="absolute bottom-3 right-3 p-2.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <Maximize2 size={18} className="text-gray-700" />
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-5">
          {/* Title & Share */}
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{place.name}</h1>
            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <Share2 size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Location & Maps */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-gray-600">
              <MapPin size={16} className="text-gray-400" />
              {formatArea(place.area)}
            </span>
            <button
              onClick={openGoogleMaps}
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#CA4141] transition-colors"
            >
              <Navigation size={16} className="text-gray-400" />
              View on Google Maps
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={handlePlan}
            disabled={planningId === placeId}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl transition-colors ${
              isPlanned(placeId)
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-[#CA4141] hover:bg-[#b33a3a] text-white'
            }`}
          >
            {planningId === placeId ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isPlanned(placeId) ? (
              <Check size={18} />
            ) : (
              <Calendar size={18} />
            )}
            <span className="font-medium">
              {isPlanned(placeId) ? 'Planned' : 'Planning to Visit'}
            </span>
          </button>

          {/* Why this place? */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h2 className="font-semibold text-gray-900 mb-2">Why this place?</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 text-sm">
                  <Wallet size={16} className="text-[#CA4141]" />
                  Price Range
                </span>
                <span className="font-medium text-gray-900 text-sm">
                  {formatPrice(place.priceRange)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 text-sm">
                  <ParkingCircle size={16} className="text-[#CA4141]" />
                  Parking
                </span>
                <span className="font-medium text-gray-900 text-sm">
                  {place.hasParking ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 text-sm">
                  <Users size={16} className="text-[#CA4141]" />
                  Crowd
                </span>
                <span className="font-medium text-gray-900 text-sm">
                  {place.crowdLevel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 text-sm">
                  <Wine size={16} className="text-[#CA4141]" />
                  Alcohol
                </span>
                <span className="font-medium text-gray-900 text-sm">
                  {place.alcoholAvailable ? 'Served' : 'Not Served'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 text-sm">
                  <Sun size={16} className="text-[#CA4141]" />
                  Ambience
                </span>
                <span className="font-medium text-gray-900 text-sm">
                  {place.ambience}
                </span>
              </div>
            </div>
          </div>

          {/* Perfect for */}
          {place.perfectFor && place.perfectFor.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Perfect for</h2>
              <div className="flex flex-wrap gap-2">
                {place.perfectFor.map((mood) => {
                  const Icon = mood.icon
                  return (
                    <span
                      key={mood.name}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                    >
                      <Icon size={14} className="text-[#CA4141]" />
                      {mood.name}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Highlights */}
          {place.highlights && place.highlights.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {place.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Details */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Contact & Details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {place.contactPhone && (
                <a
                  href={`tel:${place.contactPhone}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#CA4141] transition-colors"
                >
                  <Phone size={16} className="text-gray-400" />
                  {place.contactPhone}
                </a>
              )}
              {place.instagramHandle && (
                <a
                  href={`https://instagram.com/${place.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#CA4141] transition-colors"
                >
                  <Instagram size={16} className="text-gray-400" />
                  {place.instagramHandle}
                </a>
              )}
              {place.website && (
                <a
                  href={`https://${place.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#CA4141] transition-colors"
                >
                  <Globe size={16} className="text-gray-400" />
                  {place.website}
                </a>
              )}
              {place.openingHours && (
                <span className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} className="text-gray-400" />
                  {place.openingHours}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title Row */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {place.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-gray-400" />
                    {formatArea(place.area)}
                  </span>
                  <button
                    onClick={openGoogleMaps}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Navigation size={16} className="text-gray-400" />
                    View on Google Maps
                  </button>
                </div>
              </div>
              <button className="p-2.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                <Share2 size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Why this place? */}
            <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-2">
                Why this place?
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {place.description}
              </p>
            </div>

            {/* Perfect for */}
            {place.perfectFor && place.perfectFor.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Perfect for</h2>
                <div className="flex flex-wrap gap-2">
                  {place.perfectFor.map((mood) => {
                    const Icon = mood.icon
                    return (
                      <span
                        key={mood.name}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                      >
                        <Icon size={14} className="text-[#CA4141]" />
                        {mood.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Highlights */}
            {place.highlights && place.highlights.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {place.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Details */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">
                Contact & Details
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                {place.contactPhone && (
                  <a
                    href={`tel:${place.contactPhone}`}
                    className="flex items-center gap-2 hover:text-[#CA4141] transition-colors"
                  >
                    <Phone size={16} className="text-gray-400" />
                    {place.contactPhone}
                  </a>
                )}
                {place.instagramHandle && (
                  <a
                    href={`https://instagram.com/${place.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#CA4141] transition-colors"
                  >
                    <Instagram size={16} className="text-gray-400" />
                    {place.instagramHandle}
                  </a>
                )}
                {place.website && (
                  <a
                    href={`https://${place.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#CA4141] transition-colors"
                  >
                    <Globe size={16} className="text-gray-400" />
                    {place.website}
                  </a>
                )}
                {place.openingHours && (
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    {place.openingHours}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={savingId === placeId}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                  isSaved(placeId)
                    ? 'bg-[#CA4141] border-[#CA4141] text-white'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {savingId === placeId ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Heart size={18} className={isSaved(placeId) ? 'fill-white' : 'text-gray-500'} />
                )}
                <span className={`text-sm font-medium ${isSaved(placeId) ? 'text-white' : 'text-gray-700'}`}>
                  {isSaved(placeId) ? 'Saved' : 'Save to Favourites'}
                </span>
              </button>
              <button
                onClick={handlePlan}
                disabled={planningId === placeId}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition-colors ${
                  isPlanned(placeId)
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-[#CA4141] hover:bg-[#b33a3a] text-white'
                }`}
              >
                {planningId === placeId ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isPlanned(placeId) ? (
                  <Check size={18} />
                ) : (
                  <Calendar size={18} />
                )}
                <span className="text-sm font-medium">
                  {isPlanned(placeId) ? 'Planned' : 'Plan a Visit'}
                </span>
              </button>
            </div>

            {/* Details Card */}
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600 text-sm">
                    <Wallet size={16} className="text-[#CA4141]" />
                    Price Range
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {formatPrice(place.priceRange)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600 text-sm">
                    <ParkingCircle size={16} className="text-[#CA4141]" />
                    Parking
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {place.hasParking ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users size={16} className="text-[#CA4141]" />
                    Crowd
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {place.crowdLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600 text-sm">
                    <Wine size={16} className="text-[#CA4141]" />
                    Alcohol
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {place.alcoholAvailable ? 'Served' : 'Not Served'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600 text-sm">
                    <Sun size={16} className="text-[#CA4141]" />
                    Ambience
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {place.ambience}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
