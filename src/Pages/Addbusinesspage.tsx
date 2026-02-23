import { useState, useRef } from "react"
import { useRouter } from "@tanstack/react-router"
import { ArrowLeft, Upload, Clock, MapPin, LocateFixed } from "lucide-react"
import { Input } from "@/components/ui/input"

const CATEGORIES = ["Restaurant", "Cafe", "Experince", "Hotel",  "Other"]
const AREAS = ["Thamel", "Patan", "Bhaktapur","Boudha",  "Lazimpat", "Baneshwor", "Newroad", "Pulchowk", "Jhamsikhel"]

const BEST_FOR_OPTIONS = [
  { label: "Date",             value: "date" },
  { label: "Coffee & Guff",   value: "coffee-guff" },
  { label: "Family Dinner",   value: "family-dinner" },
  { label: "Quiet Work",      value: "quiet-work" },
  { label: "Budget Hangout",  value: "budget-hangout" },
  { label: "Tourist Day-Out", value: "tourist-day-out" },
]

const SPECIAL_FEATURES = ["WiFi", "Kid-friendly", "Outdoor", "Pet-friendly","EV-Charging","Parking Space"]

export default function AddBusinessPage() {
  const router = useRouter()

  const [category, setCategory] = useState("")
  const [area, setArea] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [parking, setParking] = useState("")
  const [crowdLevel, setCrowdLevel] = useState("")
  const [alcoholServed, setAlcoholServed] = useState("")
  const [bestFor, setBestFor] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationAddress, setLocationAddress] = useState("")
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")

  function toggleBestFor(option: string) {
    setBestFor((prev) =>
      prev.includes(option)
        ? prev.filter((v) => v !== option)
        : prev.length < 3
          ? [...prev, option]
          : prev
    )
  }

  function toggleFeature(feature: string) {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((v) => v !== feature) : [...prev, feature]
    )
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setPhotos((prev) => [...prev, ...Array.from(e.target.files!)].slice(0, 10))
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  function detectLocation() {
    setLocationError("")
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setLocation({ lat, lng })
        // Reverse geocode using free Nominatim API
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          )
          const data = await res.json()
          setLocationAddress(data.display_name ?? `${lat}, ${lng}`)
        } catch {
          setLocationAddress(`${lat}, ${lng}`)
        }
        setLocationLoading(false)
      },
      () => {
        setLocationError("Unable to retrieve your location. Please allow location access.")
        setLocationLoading(false)
      }
    )
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"))
    setPhotos(files.slice(0, 10))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => router.history.back()}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-5 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Add Your Business</h1>
      <p className="text-gray-500 text-sm mb-6">
        Share your business with local explorers. Get reviewed and featured within 24 hours.
      </p>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <form className="flex flex-col gap-6">

          {/* Business Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Business Name <span className="text-[#CA4141]">*</span>
            </label>
            <Input placeholder="Enter business name" required className="rounded-lg" />
          </div>

          {/* Category + Area */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Category <span className="text-[#CA4141]">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#CA4141]/30 focus:border-[#CA4141] pr-8"
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  ▾
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Area <span className="text-[#CA4141]">*</span>
              </label>
              <div className="relative">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#CA4141]/30 focus:border-[#CA4141] pr-8"
                >
                  <option value="" disabled>Select area</option>
                  {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Contact (Phone/Email) <span className="text-[#CA4141]">*</span>
            </label>
            <Input placeholder="Enter contact number" required className="rounded-lg" />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Location <span className="text-[#CA4141]">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Address will appear here after detection"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="rounded-lg flex-1"
              />
              <button
                type="button"
                onClick={detectLocation}
                disabled={locationLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#CA4141] hover:bg-[#b33636] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                <LocateFixed size={15} />
                {locationLoading ? "Detecting..." : "Use My Location"}
              </button>
            </div>

            {locationError && (
              <p className="text-xs text-red-500">{locationError}</p>
            )}

            {location && (
              <>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={12} className="text-[#CA4141]" />
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-200 h-52 mt-1">
                  <iframe
                    title="Business Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
                    allowFullScreen
                  />
                </div>
              </>
            )}
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Price Range <span className="text-[#CA4141]">*</span>
            </label>
            <div className="flex items-center gap-6">
              {["Budget", "Mid", "Premium"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    value={opt}
                    checked={priceRange === opt}
                    onChange={() => setPriceRange(opt)}
                    className="accent-[#CA4141]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Parking */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Parking Available <span className="text-[#CA4141]">*</span>
            </label>
            <div className="flex items-center gap-6">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="parking"
                    value={opt}
                    checked={parking === opt}
                    onChange={() => setParking(opt)}
                    className="accent-[#CA4141]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Crowd Level */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Crowd Level <span className="text-[#CA4141]">*</span>
            </label>
            <div className="flex items-center gap-6">
              {["Quiet", "Moderate", "Lively"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="crowdLevel"
                    value={opt}
                    checked={crowdLevel === opt}
                    onChange={() => setCrowdLevel(opt)}
                    className="accent-[#CA4141]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Alcohol Served */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Alcohol Served <span className="text-[#CA4141]">*</span>
            </label>
            <div className="flex items-center gap-6">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="alcoholServed"
                    value={opt}
                    checked={alcoholServed === opt}
                    onChange={() => setAlcoholServed(opt)}
                    className="accent-[#CA4141]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Best For */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Best For (Select up to 3) <span className="text-[#CA4141]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {BEST_FOR_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bestFor.includes(opt.value)}
                    onChange={() => toggleBestFor(opt.value)}
                    disabled={!bestFor.includes(opt.value) && bestFor.length >= 3}
                    className="accent-[#CA4141]"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Upload Photos */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Upload Photos (3-10 images) <span className="text-[#CA4141]">*</span>
            </label>

            {/* Drop zone — hide when 10 photos reached */}
            {photos.length < 10 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#CA4141]/50 transition-colors"
              >
                <Upload size={28} className="text-[#CA4141]" />
                <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-300">{photos.length}/10 uploaded</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Photo previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-1">
                {photos.map((file, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 h-fit">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`upload-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-[#CA4141] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Website</label>
            <Input placeholder="https://www.example.com" type="url" className="rounded-lg" />
          </div>

          {/* Instagram Handle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Instagram Handle</label>
            <Input placeholder="@yourbusiness" className="rounded-lg" />
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Opening Hours</label>
            <div className="relative">
              <Input placeholder="e.g. Mon–Fri 9am–9pm" className="rounded-lg pr-10" />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <Clock size={16} />
              </span>
            </div>
          </div>

          {/* Special Features */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">Special Features</label>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {SPECIAL_FEATURES.map((feat) => (
                <label key={feat} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.includes(feat)}
                    onChange={() => toggleFeature(feat)}
                    className="accent-[#CA4141]"
                  />
                  {feat}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#CA4141] hover:bg-[#b33636] text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            Submit Your Business
          </button>

        </form>
      </div>
    </div>
  )
}
