import { useState, useEffect, useCallback } from 'react'
import { useProgress } from '@/hooks/useProgress'
import { Navigation, ViewMode } from '@/components/Navigation'
import { TodayView } from '@/components/TodayView'
import { ExtraPractice } from '@/components/ExtraPractice'
import { ProgressView } from '@/components/ProgressView'
import { MistakesView } from '@/components/MistakesView'
import { GlossaryView } from '@/components/GlossaryView'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import type { DailyLesson } from '@/data/dailyContent'
import { fetchOrGenerateLesson } from '@/lib/lessonService'
import type { GlossaryEntry } from '@/hooks/useProgress'
import {
  getDeviceId,
  fetchGlossaryFromSupabase,
  upsertGlossaryWord,
  deleteGlossaryWord,
} from '@/lib/glossaryService'

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('today')
  const [targetDay, setTargetDay] = useState(1)
  const [lesson, setLesson] = useState<DailyLesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    progress,
    getDayProgress,
    markTextCompleted,
    markTasksCompleted,
    markConsolidationCompleted,
    markExtraPracticeCompleted,
    addMistake,
    addToGlossary,
    addManualWord,
    mergeGlossary,
    deleteWord,
    getMistakesForDay,
  } = useProgress()

  // Init: set target day + load glossary from Supabase
  useEffect(() => {
    setTargetDay(progress.currentDay)
    const deviceId = getDeviceId()
    fetchGlossaryFromSupabase(deviceId)
      .then((remote) => mergeGlossary(remote))
      .catch(console.error)
  }, [])

  const dayProgress = getDayProgress(targetDay)
  const todayMistakes = getMistakesForDay(targetDay)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setLesson(null)

    const prevMistakeCount = targetDay > 1
      ? (progress.days[targetDay - 1]?.mistakes?.length ?? 0)
      : 0

    fetchOrGenerateLesson(targetDay, prevMistakeCount)
      .then((l) => {
        if (!cancelled) {
          setLesson(l)
          setLoading(false)
          if (l.text?.vocabulary) handleAddToGlossary(l.text.vocabulary)
        }
      })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false) } })

    return () => { cancelled = true }
  }, [targetDay])

  useEffect(() => {
    if (currentView === 'today') setTargetDay(progress.currentDay)
  }, [currentView])

  // Glossary handlers — update localStorage + sync to Supabase
  const handleAddToGlossary = useCallback((words: { word: string; translation: string; explanation?: string; explanationRu?: string; example?: string; exampleRu?: string }[]) => {
    addToGlossary(words)
    const deviceId = getDeviceId()
    words.forEach(({ word, translation, explanation, explanationRu, example, exampleRu }) => {
      const key = word.toLowerCase().trim()
      upsertGlossaryWord(deviceId, key, { translation, explanation, explanationRu, example, exampleRu })
        .catch(console.error)
    })
  }, [addToGlossary])

  const handleAddManualWord = useCallback((word: string, entry: GlossaryEntry) => {
    addManualWord(word, entry)
    const deviceId = getDeviceId()
    upsertGlossaryWord(deviceId, word.toLowerCase().trim(), { ...entry, manual: true })
      .catch(console.error)
  }, [addManualWord])

  const handleEnrichWord = useCallback((word: string, entry: GlossaryEntry) => {
    addToGlossary([{ word, ...entry }])
    const deviceId = getDeviceId()
    upsertGlossaryWord(deviceId, word.toLowerCase().trim(), entry)
      .catch(console.error)
  }, [addToGlossary])

  const handleDeleteWord = useCallback((word: string) => {
    deleteWord(word)
    const deviceId = getDeviceId()
    deleteGlossaryWord(deviceId, word.toLowerCase().trim())
      .catch(console.error)
  }, [deleteWord])

  const handleMistake = (
    taskId: string, question: string, userAnswer: string,
    correctAnswer: string, explanationRu: string
  ) => addMistake(targetDay, { taskId, question, userAnswer, correctAnswer, explanationRu })

  const handleNextLesson = () => setTargetDay((d) => d + 1)

  const canGoBack = targetDay > 1
  const canGoForward = targetDay < progress.currentDay

  if (loading) {
    return (
      <div className="min-h-screen bg-reading-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-reading">
            {targetDay === 1 ? 'Готовим первый урок...' : `Генерируем урок ${targetDay}...`}
          </p>
          <p className="text-sm text-muted-foreground/60">~10 секунд</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-reading-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-destructive font-medium">Не удалось загрузить урок</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  if (!lesson) return null

  const showLessonNav = currentView === 'today' || currentView === 'extra'

  return (
    <div className="min-h-screen bg-reading-bg">
      {showLessonNav && (
        <div className="sticky top-0 z-30 bg-reading-bg/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setTargetDay((d) => Math.max(1, d - 1))} disabled={!canGoBack}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Урок {targetDay}</span>
            <Button variant="ghost" size="sm" onClick={() => setTargetDay((d) => Math.min(progress.currentDay, d + 1))} disabled={!canGoForward}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {currentView === 'today' && (
          <TodayView
            lesson={lesson} dayProgress={dayProgress}
            onMarkTextCompleted={() => markTextCompleted(targetDay)}
            onMarkTasksCompleted={() => markTasksCompleted(targetDay)}
            onMarkConsolidationCompleted={() => markConsolidationCompleted(targetDay)}
            onMistake={handleMistake}
            onNextLesson={handleNextLesson}
          />
        )}
        {currentView === 'extra' && (
          <ExtraPractice
            lesson={lesson} isCompleted={dayProgress.extraPracticeCompleted}
            onComplete={() => markExtraPracticeCompleted(targetDay)}
            onMistake={handleMistake}
          />
        )}
        {currentView === 'mistakes' && <MistakesView mistakes={todayMistakes} day={targetDay} />}
        {currentView === 'progress' && <ProgressView progress={progress} />}
        {currentView === 'glossary' && (
          <GlossaryView
            glossary={progress.glossary}
            onAddWord={handleAddManualWord}
            onEnrichWord={handleEnrichWord}
            onDeleteWord={handleDeleteWord}
          />
        )}
      </main>

      <Navigation currentView={currentView} onViewChange={setCurrentView} hasMistakes={todayMistakes.length > 0} />
    </div>
  )
}

export default Index
