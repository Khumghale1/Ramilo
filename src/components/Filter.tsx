import { useState, useRef, useEffect } from 'react'
import { Check, SlidersHorizontal, X } from 'lucide-react'

export interface FilterValues {
  area: string
  priceRange: string
  parking: string
  crowdLevel: string
  alcohol: string
  ambience: string
}

interface FilterProps {
  values?: FilterValues
  onChange?: (values: FilterValues) => void
}

const filterOptions = {
  area: ['Any Area', 'Thamel', 'Lazimpat', 'Patan', 'Baneshwor'],
  priceRange: ['Any Price', 'Budget', 'Mid-range', 'Premium'],
  parking: ['Any', 'Yes', 'No'],
  crowdLevel: ['Quiet', 'Moderate', 'Lively'],
  alcohol: ['Any', 'Yes', 'No'],
  ambience: ['Outdoor', 'View', 'Indoor'],
}

const filterLabels: Record<keyof FilterValues, string> = {
  area: 'Area',
  priceRange: 'Price Range',
  parking: 'Parking',
  crowdLevel: 'Crowd Level',
  alcohol: 'Alcohol',
  ambience: 'Ambience',
}

const filterKeys: (keyof FilterValues)[] = ['area', 'priceRange', 'parking', 'crowdLevel', 'alcohol', 'ambience']

export const defaultFilterValues: FilterValues = {
  area: 'Any Area',
  priceRange: 'Budget',
  parking: 'Yes',
  crowdLevel: 'Quiet',
  alcohol: 'Any',
  ambience: 'Outdoor',
}

export function Filter({ values = defaultFilterValues, onChange }: FilterProps) {
  const [openDropdown, setOpenDropdown] = useState<keyof FilterValues | null>(null)
  const [localValues, setLocalValues] = useState<FilterValues>(values)
  const [mobileOpen, setMobileOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent body scroll when mobile panel is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleSelect = (key: keyof FilterValues, option: string) => {
    const newValues = { ...localValues, [key]: option }
    setLocalValues(newValues)
    onChange?.(newValues)
    setOpenDropdown(null)
  }

  // Count active filters (non-default values)
  const activeFilterCount = filterKeys.filter(
    (key) => localValues[key] !== defaultFilterValues[key]
  ).length

  return (
    <>
      {/* Mobile: Filter Icon Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors"
      >
        <SlidersHorizontal size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 bg-[#CA4141] text-white text-xs font-medium rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile: Slide-in Panel */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-out overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Options */}
            <div className="p-4 space-y-5">
              {filterKeys.map((key) => (
                <div key={key}>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {filterLabels[key]}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions[key].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelect(key, option)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          localValues[key] === option
                            ? 'bg-[#CA4141] text-white border-[#CA4141]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Desktop: Horizontal Filter Bar */}
      <div ref={containerRef} className="relative hidden md:flex items-center border border-gray-200 rounded-full overflow-visible bg-white">
        {filterKeys.map((key, index) => (
          <div key={key} className="relative flex-1">
            <button
              onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
              className={`w-full flex flex-col items-start gap-0.5 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                index !== filterKeys.length - 1 ? 'border-r border-gray-200' : ''
              } ${openDropdown === key ? 'bg-gray-50' : ''}`}
            >
              <span className="text-xs text-gray-500">{filterLabels[key]}</span>
              <span className="text-sm font-medium text-gray-900">{localValues[key]}</span>
            </button>

            {/* Dropdown */}
            {openDropdown === key && (
              <div className="absolute top-full left-0 mt-2 min-w-[140px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {filterOptions[key].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(key, option)}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                      localValues[key] === option ? 'bg-red-50 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {localValues[key] === option && (
                      <Check size={14} className="text-[#CA4141]" />
                    )}
                    <span className={localValues[key] === option ? '' : 'pl-[22px]'}>{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
