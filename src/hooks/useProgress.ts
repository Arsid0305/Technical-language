import { useState, useEffect, useCallback, useRef } from 'react'
import { getDeviceId } from '@/lib/glossaryService'
import { fetchLatestProgress, saveProgressToSupabase } from '@/lib/progressService'

export interface Mistake {
  day: number
  taskId: string
  question: string
  userAnswer: string
  correctAnswer: string
  explanationRu: string
  timestamp: number
}

export interface DayProgress {
  day: number
  textCompleted: boolean
  tasksCompleted: boolean
  extraPracticeCompleted: boolean
  consolidationCompleted: boolean
  mistakes: Mistake[]
  completedAt?: number
}

export interface GlossaryEntry {
  translation: string
  explanation?: string
  explanationRu?: string
  example?: string
  exampleRu?: string
  manual?: boolean
}

export interface UserProgress {
  currentDay: number
  days: Record<number, DayProgress>
  recognizedActions: string[]
  glossary: Record<string, GlossaryEntry>
}

const STORAGE_KEY = 'reader-progress'

const defaultProgress: UserProgress = {
  currentDay: 1,
  days: {},
  recognizedActions: [],
  glossary: {},
}

function getDefaultDayProgress(day: number): DayProgress {
  return {
    day,
    textCompleted: false,
    tasksCompleted: false,
    extraPracticeCompleted: false,
    consolidationCompleted: false,
    mistakes: [],
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.glossary) {
          const migrated: Record<string, GlossaryEntry> = {}
          for (const [k, v] of Object.entries(parsed.glossary)) {
            migrated[k] = typeof v === 'string' ? { translation: v as string } : (v as GlossaryEntry)
          }
          parsed.glossary = migrated
        }
        return { ...defaultProgress, ...parsed }
      }
    } catch (e) {
      console.error('Failed to load progress:', e)
    }
    return defaultProgress
  })

  const fromRemote = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // On mount: load latest progress from Supabase (last saved on any device wins)
  useEffect(() => {
    fetchLatestProgress()
      .then((remote) => {
        if (!remote) return
        fromRemote.current = true
        setProgress({ ...defaultProgress, ...(remote as Partial<UserProgress>) })
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch (e) {
      console.error('Failed to save progress:', e)
      window.dispatchEvent(new CustomEvent('storage-quota-exceeded'))
    }
    // Skip Supabase save when this change came from Supabase load
    if (fromRemote.current) {
      fromRemote.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveProgressToSupabase(progress as unknown as Record<string, unknown>)
        .catch(console.error)
    }, 1500)
  }, [progress])

  const getDayProgress = useCallback((day: number): DayProgress => {
    return progress.days[day] ?? getDefaultDayProgress(day)
  }, [progress.days])

  const markTextCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: { ...prev.days, [day]: { ...(prev.days[day] ?? getDefaultDayProgress(day)), textCompleted: true } },
    }))
  }, [])

  const markTasksCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: { ...prev.days, [day]: { ...(prev.days[day] ?? getDefaultDayProgress(day)), tasksCompleted: true } },
    }))
  }, [])

  const markExtraPracticeCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: { ...prev.days, [day]: { ...(prev.days[day] ?? getDefaultDayProgress(day)), extraPracticeCompleted: true } },
    }))
  }, [])

  const markConsolidationCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: { ...(prev.days[day] ?? getDefaultDayProgress(day)), consolidationCompleted: true, completedAt: Date.now() },
      },
      currentDay: Math.max(prev.currentDay, day + 1),
    }))
  }, [])

  const addMistake = useCallback((day: number, mistake: Omit<Mistake, 'day' | 'timestamp'>) => {
    setProgress((prev) => {
      const dayProgress = prev.days[day] ?? getDefaultDayProgress(day)
      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: { ...dayProgress, mistakes: [...dayProgress.mistakes, { ...mistake, day, timestamp: Date.now() }] },
        },
      }
    })
  }, [])

  const addToGlossary = useCallback((
    words: { word: string; translation: string; explanation?: string; explanationRu?: string; example?: string; exampleRu?: string }[]
  ) => {
    setProgress((prev) => {
      const updated = { ...prev.glossary }
      let changed = false
      for (const { word, translation, explanation, explanationRu, example, exampleRu } of words) {
        const key = word.toLowerCase().trim()
        if (!updated[key]) {
          updated[key] = { translation, explanation, explanationRu, example, exampleRu }
          changed = true
        } else {
          const patch: Partial<GlossaryEntry> = {}
          if (explanation && !updated[key].explanation) patch.explanation = explanation
          if (explanationRu && !updated[key].explanationRu) patch.explanationRu = explanationRu
          if (example && !updated[key].example) patch.example = example
          if (exampleRu && !updated[key].exampleRu) patch.exampleRu = exampleRu
          if (Object.keys(patch).length > 0) { updated[key] = { ...updated[key], ...patch }; changed = true }
        }
      }
      if (!changed) return prev
      return { ...prev, glossary: updated }
    })
  }, [])

  const addManualWord = useCallback((word: string, entry: GlossaryEntry) => {
    const key = word.toLowerCase().trim()
    setProgress((prev) => ({
      ...prev,
      glossary: { ...prev.glossary, [key]: { ...entry, manual: true } },
    }))
  }, [])

  const mergeGlossary = useCallback((remote: Record<string, GlossaryEntry>) => {
    setProgress((prev) => {
      const merged = { ...remote, ...prev.glossary }
      return { ...prev, glossary: merged }
    })
  }, [])

  const deleteWord = useCallback((word: string) => {
    const key = word.toLowerCase().trim()
    setProgress((prev) => {
      const { [key]: _removed, ...rest } = prev.glossary
      return { ...prev, glossary: rest }
    })
  }, [])

  const addRecognizedAction = useCallback((action: string) => {
    setProgress((prev) => {
      if (prev.recognizedActions.includes(action)) return prev
      return { ...prev, recognizedActions: [...prev.recognizedActions, action] }
    })
  }, [])

  const getTotalTextsCompleted = useCallback(() =>
    Object.values(progress.days).filter((d) => d.textCompleted).length,
  [progress.days])

  const getTotalDaysCompleted = useCallback(() =>
    Object.values(progress.days).filter((d) => d.consolidationCompleted).length,
  [progress.days])

  const getMistakesForDay = useCallback((day: number): Mistake[] =>
    getDayProgress(day).mistakes,
  [getDayProgress])

  const resetProgress = useCallback(() => setProgress(defaultProgress), [])

  return {
    progress,
    getDayProgress,
    markTextCompleted,
    markTasksCompleted,
    markExtraPracticeCompleted,
    markConsolidationCompleted,
    addMistake,
    addToGlossary,
    addManualWord,
    mergeGlossary,
    deleteWord,
    addRecognizedAction,
    getTotalTextsCompleted,
    getTotalDaysCompleted,
    getMistakesForDay,
    resetProgress,
  }
}
