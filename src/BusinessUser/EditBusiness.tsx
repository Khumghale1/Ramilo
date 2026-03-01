import { useState, useEffect, useRef } from "react"
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft, Upload, Clock, MapPin, LocateFixed, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getMySubmissionById, updateMySubmission, type BusinessSubmission } from "@/lib/api"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

interface EditBusinessProps {
  id: string
}

const CATEGORIES = [
  { label: "Restaurant", value: "RESTAURANT" },
  { label: "Cafe", value: "CAFE" },
  { label: "Hotel", value: "HOTEL" },
  { label: "Experience", value: "EXPERIENCE" },
  { label: "Other", value: "OTHER" },
]

const AREAS = [
  { label: "Thamel", value: "THAMEL" },
  { label: "Jhamsikhel", value: "JHAMSIKHEL" },
  { label: "Durbar Marg", value: "DURBAR_MARG" },
  { label: "Lazimpat", value: "LAZIMPAT" },
  { label: "Boudha", value: "BOUDHA" },
  { label: "Patan", value: "PATAN" },
  { label: "Bhaktapur", value: "BHAKTAPUR" },
  { label: "Swayambhu", value: "SWAYAMBHU" },
  { label: "Baluwatar", value: "BALUWATAR" },
  { label: "New Baneshwor", value: "NEW_BANESHWOR" },
  { label: "Pulchowk", value: "PULCHOWK" },
  { label: "Sanepa", value: "SANEPA" },
  { label: "Kalanki", value: "KALANKI" },
  { label: "Koteshwor", value: "KOTESHWOR" },
  { label: "Basundhara", value: "BASUNDHARA" },
]

const PRICE_RANGES = [
  { label: "Budget", value: "BUDGET" },
  { label: "Mid", value: "MID" },
  { label: "Premium", value: "PREMIUM" },
]

const CROWD_LEVELS = [
  { label: "Quiet", value: "QUIET" },
  { label: "Moderate", value: "MODERATE" },
  { label: "Lively", value: "LIVELY" },
]

const BEST_FOR_OPTIONS = [
  { label: "Date", value: "DATE" },
  { label: "Coffee & Guff", value: "COFFEE_GUFF" },
  { label: "Family Dinner", value: "FAMILY_DINNER" },
  { label: "Quiet Work", value: "QUIET_WORK" },
  { label: "Budget Hangout", value: "BUDGET_HANGOUT" },
  { label: "Tourist Day-Out", value: "TOURIST_DAY_OUT" },
]

const SPECIAL_FEATURES = ["WiFi", "Kid-friendly", "Outdoor", "Pet-friendly", "EV-Charging", "Parking Space"]

export default function EditBusiness({ id }: EditBusinessProps) {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submission, setSubmission] = useState<BusinessSubmission | null>(null)
  const [error, setError] = useState("")

  const [businessName, setBusinessName] = useState("")
  const [category, setCategory] = useState("")
  const [area, setArea] = useState("")
  const [contact, setContact] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [parking, setParking] = useState("")
  const [crowdLevel, setCrowdLevel] = useState("")
  const [alcoholServed, setAlcoholServed] = useState("")
  const [bestFor, setBestFor] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [existingPhotos, setExistingPhotos] = useState<string[]>([])
  const [newPhotos, setNewPhotos] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationAddress, setLocationAddress] = useState("")
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [website, setWebsite] = useState("")
  const [instagramHandle, setInstagramHandle] = useState("")
  const [openingHours, setOpeningHours] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    loadSubmission()
  }, [id])

  async function loadSubmission() {
    try {
      setLoading(true)
      const data = await getMySubmissionById(id)
      setSubmission(data)

      // Populate form fields
      setBusinessName(data.businessName)
      setCategory(data.category)
      setArea(data.area)
      setContact(data.contact)
      setPriceRange(data.priceRange)
      setParking(data.hasParking ? "Yes" : "No")
      setCrowdLevel(data.crowdLevel)
      setAlcoholServed(data.alcoholAvailable ? "Yes" : "No")
      setBestFor(data.bestForMoods)
      setExistingPhotos(data.photos)
      setWebsite(data.website || "")
      setInstagramHandle(data.instagramHandle || "")
      setOpeningHours(data.openingHours || "")
      setFeatures(data.specialFeatures || [])

      if (data.latitude && data.longitude) {
        setLocation({ lat: data.latitude, lng: data.longitude })
      }
      if (data.address) {
        setLocationAddress(data.address)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load submission")
    } finally {
      setLoading(false)
    }
  }

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
      const totalPhotos = existingPhotos.length + newPhotos.length + e.target.files.length
      if (totalPhotos <= 10) {
        setNewPhotos((prev) => [...prev, ...Array.from(e.target.files!)])
      }
    }
  }

  function removeExistingPhoto(index: number) {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  function removeNewPhoto(index: number) {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index))
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
        try {
          const res = await fetch(`${API_URL}/api/geocode/reverse?lat=${lat}&lng=${lng}`)
          if (res.ok) {
            const data = await res.json()
            setLocationAddress(data.data?.address ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          } else {
            setLocationAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          }
        } catch {
          setLocationAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
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
    const totalPhotos = existingPhotos.length + newPhotos.length + files.length
    if (totalPhotos <= 10) {
      setNewPhotos((prev) => [...prev, ...files])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError("")

    const totalPhotos = existingPhotos.length + newPhotos.length
    if (totalPhotos < 3) {
      setSubmitError("Please have at least 3 photos")
      return
    }

    if (bestFor.length === 0) {
      setSubmitError("Please select at least one 'Best For' option")
      return
    }

    setSubmitting(true)

    try {
      let allPhotos = [...existingPhotos]

      // Upload new photos if any
      if (newPhotos.length > 0) {
        const formData = new FormData()
        newPhotos.forEach((photo) => formData.append("images", photo))

        const uploadRes = await fetch(`${API_URL}/api/upload/business`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })

        if (!uploadRes.ok) {
          const err = await uploadRes.json()
          throw new Error(err.message || "Failed to upload images")
        }

        const uploadData = await uploadRes.json()
        allPhotos = [...allPhotos, ...uploadData.data.urls]
      }

      // Update submission
      await updateMySubmission(id, {
        businessName,
        category,
        area,
        contact,
        latitude: location?.lat,
        longitude: location?.lng,
        address: locationAddress || undefined,
        priceRange,
        hasParking: parking === "Yes",
        crowdLevel,
        alcoholAvailable: alcoholServed === "Yes",
        bestForMoods: bestFor,
        photos: allPhotos,
        website: website || undefined,
        instagramHandle: instagramHandle || undefined,
        openingHours: openingHours || undefined,
        specialFeatures: features.length > 0 ? features : undefined,
      })

      navigate({ to: "/business" })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#CA4141]" />
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error || "Submission not found"}
      </div>
    )
  }

  if (submission.status !== "PENDING") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        You can only edit pending submissions.
      </div>
    )
  }

  const totalPhotos = existingPhotos.length + newPhotos.length

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate({ to: "/business" })}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-5 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Business</h1>
      <p className="text-gray-500 text-sm mb-6">
        Update your business details. Changes will be reviewed before going live.
      </p>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          {/* Business Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Business Name <span className="text-[#CA4141]">*</span>
            </label>
            <Input
              placeholder="Enter business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="rounded-lg"
            />
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
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
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
                  {AREAS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
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
            <Input
              placeholder="Enter contact number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Location</label>
            <div className="flex gap-2">
              <Input
                placeholder="Address"
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

            {locationError && <p className="text-xs text-red-500">{locationError}</p>}

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
              {PRICE_RANGES.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    value={opt.value}
                    checked={priceRange === opt.value}
                    onChange={() => setPriceRange(opt.value)}
                    className="accent-[#CA4141]"
                  />
                  {opt.label}
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
              {CROWD_LEVELS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="crowdLevel"
                    value={opt.value}
                    checked={crowdLevel === opt.value}
                    onChange={() => setCrowdLevel(opt.value)}
                    className="accent-[#CA4141]"
                  />
                  {opt.label}
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

          {/* Photos */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Photos (3-10 images) <span className="text-[#CA4141]">*</span>
            </label>

            {/* Existing Photos */}
            {existingPhotos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-2">
                {existingPhotos.map((url, index) => (
                  <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt={`photo-${index}`} className="w-full h-20 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-[#CA4141] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Photos */}
            {newPhotos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-2">
                {newPhotos.map((file, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`new-${index}`}
                      className="w-full h-20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-[#CA4141] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Zone */}
            {totalPhotos < 10 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-xl py-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#CA4141]/50 transition-colors"
              >
                <Upload size={24} className="text-[#CA4141]" />
                <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-300">{totalPhotos}/10 uploaded</p>
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
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Website</label>
            <Input
              placeholder="https://www.example.com"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="rounded-lg"
            />
          </div>

          {/* Instagram Handle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Instagram Handle</label>
            <Input
              placeholder="@yourbusiness"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              className="rounded-lg"
            />
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Opening Hours</label>
            <div className="relative">
              <Input
                placeholder="e.g. Mon-Fri 9am-9pm"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="rounded-lg pr-10"
              />
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
            disabled={submitting}
            className="w-full bg-[#CA4141] hover:bg-[#b33636] text-white font-medium py-3 rounded-xl transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
