import { useState, useEffect, useCallback } from 'react'
import { addPlan, removePlan, getPlannedVisits } from '@/lib/api'
import { useSession } from '@/lib/auth-client'
import { useAuthModal } from '@/contexts/AuthModalContext'

export function usePlanPlace() {
  const { data: session } = useSession()
  const { openLogin } = useAuthModal()
  const [plannedPlaceIds, setPlannedPlaceIds] = useState<Set<string>>(new Set())
  const [planIdMap, setPlanIdMap] = useState<Map<string, string>>(new Map()) // placeId -> planId
  const [planningId, setPlanningId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Load planned visits on mount
  useEffect(() => {
    if (!session?.user) {
      setPlannedPlaceIds(new Set())
      setPlanIdMap(new Map())
      setLoaded(true)
      return
    }

    async function loadPlans() {
      try {
        const plans = await getPlannedVisits()
        setPlannedPlaceIds(new Set(plans.map((p) => p.placeId)))
        setPlanIdMap(new Map(plans.map((p) => [p.placeId, p.id])))
      } catch {
        // Ignore errors, just show empty
      } finally {
        setLoaded(true)
      }
    }

    loadPlans()
  }, [session?.user])

  const isPlanned = useCallback(
    (placeId: string) => plannedPlaceIds.has(placeId),
    [plannedPlaceIds]
  )

  const togglePlan = useCallback(
    async (placeId: string, plannedDate?: string, moodContext?: string) => {
      if (!session?.user) {
        // User not logged in - show login modal
        openLogin()
        return { success: false, error: 'Please sign in to plan visits' }
      }

      setPlanningId(placeId)

      try {
        if (plannedPlaceIds.has(placeId)) {
          // Remove from plans
          const planId = planIdMap.get(placeId)
          if (planId) {
            await removePlan(planId)
            setPlannedPlaceIds((prev) => {
              const next = new Set(prev)
              next.delete(placeId)
              return next
            })
            setPlanIdMap((prev) => {
              const next = new Map(prev)
              next.delete(placeId)
              return next
            })
          }
        } else {
          // Add to plans
          const plan = await addPlan(placeId, plannedDate, moodContext)
          setPlannedPlaceIds((prev) => new Set(prev).add(placeId))
          setPlanIdMap((prev) => new Map(prev).set(placeId, plan.id))
        }
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to update plan',
        }
      } finally {
        setPlanningId(null)
      }
    },
    [session?.user, plannedPlaceIds, planIdMap, openLogin]
  )

  // Add to plan (without toggle)
  const planVisit = useCallback(
    async (placeId: string, plannedDate?: string, moodContext?: string) => {
      if (!session?.user) {
        openLogin()
        return { success: false, error: 'Please sign in to plan visits' }
      }

      if (plannedPlaceIds.has(placeId)) {
        return { success: true } // Already planned
      }

      setPlanningId(placeId)

      try {
        const plan = await addPlan(placeId, plannedDate, moodContext)
        setPlannedPlaceIds((prev) => new Set(prev).add(placeId))
        setPlanIdMap((prev) => new Map(prev).set(placeId, plan.id))
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to add plan',
        }
      } finally {
        setPlanningId(null)
      }
    },
    [session?.user, plannedPlaceIds, openLogin]
  )

  return {
    isPlanned,
    togglePlan,
    planVisit,
    planningId,
    isLoggedIn: !!session?.user,
    loaded,
  }
}
