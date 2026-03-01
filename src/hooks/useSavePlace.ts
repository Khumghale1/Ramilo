import { useState, useEffect, useCallback } from 'react'
import { savePlace, unsavePlace, getSavedPlaces } from '@/lib/api'
import { useSession } from '@/lib/auth-client'
import { useAuthModal } from '@/contexts/AuthModalContext'

export function useSavePlace() {
  const { data: session } = useSession()
  const { openLogin } = useAuthModal()
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set())
  const [savingId, setSavingId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Load saved places on mount
  useEffect(() => {
    if (!session?.user) {
      setSavedPlaceIds(new Set())
      setLoaded(true)
      return
    }

    async function loadSaved() {
      try {
        const saved = await getSavedPlaces()
        setSavedPlaceIds(new Set(saved.map((s) => s.placeId)))
      } catch {
        // Ignore errors, just show empty
      } finally {
        setLoaded(true)
      }
    }

    loadSaved()
  }, [session?.user])

  const isSaved = useCallback(
    (placeId: string) => savedPlaceIds.has(placeId),
    [savedPlaceIds]
  )

  const toggleSave = useCallback(
    async (placeId: string, moodContext?: string) => {
      if (!session?.user) {
        // User not logged in - show login modal
        openLogin()
        return { success: false, error: 'Please sign in to save places' }
      }

      setSavingId(placeId)

      try {
        if (savedPlaceIds.has(placeId)) {
          await unsavePlace(placeId)
          setSavedPlaceIds((prev) => {
            const next = new Set(prev)
            next.delete(placeId)
            return next
          })
        } else {
          await savePlace(placeId, moodContext)
          setSavedPlaceIds((prev) => new Set(prev).add(placeId))
        }
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to save',
        }
      } finally {
        setSavingId(null)
      }
    },
    [session?.user, savedPlaceIds, openLogin]
  )

  return {
    isSaved,
    toggleSave,
    savingId,
    isLoggedIn: !!session?.user,
    loaded,
  }
}
