import { useState, useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useProgress } from '@/hooks/useProgress'
import { Navigation, ViewMode } from '@/components/Navigation'
import { TodayView } from '@/components/TodayView'
import { ExtraPractice } from '@/components/ExtraPractice'
import { ProgressView } from '@/components/ProgressView'
import { MistakesView } from '@/components/MistakesView'
import { GlossaryView } from '@/components/GlossaryView'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react'
import { fetchOrGenerateLesson } from '@/lib/lessonService'
import type { GlossaryEntry } from '@/hooks/useProgress'
import {
  getDeviceId,
  fetchGlossaryFromSupabase,
  upsertGlossaryWord,
  deleteGlossaryWord,
} from '@/lib/glossaryService'
import { toast } from 'sonner'

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('today')
  const [targetDay, setTargetDay] = useState(1)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const queryClient = useQueryClient()

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

  useEffect(() => {
    const handleStorageError = () => {
      toast.error('Память браузера заполнена — прогресс не сохраняется', { duration: 8000 })
    }
    window.addEventListener('storage-quota-exceeded', handleStorageError)
    return () => window.removeEventListener('storage-quota-exceeded', handleStorageError)
  }, [])

  // Init: set target day + load glossary from Supabase
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTargetDay(progress.currentDay)
    fetchGlossaryFromSupabase(getDeviceId())
      .then((remote) => mergeGlossary(remote))
      .catch(console.error)
  }, [])

  const prevMistakeCount = targetDay > 1
    ? (progress.days[targetDay - 1]?.mistakes?.length ?? 0)
    : 0

  const { data: lesson, isLoading, error, refetch } = useQuery({
    queryKey: ['lesson', targetDay],
    queryFn: () => fetchOrGenerateLesson(targetDay, prevMistakeCount),
    staleTime: Infinity,
    retry: 2,
    gcTime: 1000 * 60 * 60,
  })

  const handleAddToGlossary = useCallback((
    words: { word: string; translation: string; explanation?: string; explanationRu?: string; example?: string; exampleRu?: string }[]
  ) => {
    addToGlossary(words)
    const deviceId = getDeviceId()
    words.forEach(({ word, translation, explanation, explanationRu, example, exampleRu }) => {
      upsertGlossaryWord(deviceId, word.toLowerCase().trim(), { translation, explanation, explanationRu, example, exampleRu })
        .catch(console.error)
    })
  }, [addToGlossary])

  // Add lesson vocabulary to glossary when lesson loads
  useEffect(() => {
    if (lesson?.text?.vocabulary) handleAddToGlossary(lesson.text.vocabulary)
  }, [lesson, handleAddToGlossary])

  useEffect(() => {
    if (currentView === 'today') setTargetDay(progress.currentDay)
  }, [currentView, progress.currentDay])

  const handleAddManualWord = useCallback((word: string, entry: GlossaryEntry) => {
    addManualWord(word, entry)
    upsertGlossaryWord(getDeviceId(), word.toLowerCase().trim(), { ...entry, manual: true })
      .catch(console.error)
  }, [addManualWord])

  const handleEnrichWord = useCallback((word: string, entry: GlossaryEntry) => {
    addToGlossary([{ word, ...entry }])
    upsertGlossaryWord(getDeviceId(), word.toLowerCase().trim(), entry)
      .catch(console.error)
  }, [addToGlossary])

  const handleDeleteWord = useCallback((word: string) => {
    deleteWord(word)
    deleteGlossaryWord(getDeviceId(), word.toLowerCase().trim())
      .catch(console.error)
  }, [deleteWord])

  const handleSelectLesson = useCallback((day: number) => {
    setTargetDay(day)
    setCurrentView('today')
  }, [])

  const handleMistake = (
    taskId: string, question: string, userAnswer: string,
    correctAnswer: string, explanationRu: string
  ) => addMistake(targetDay, { taskId, question, userAnswer, correctAnswer, explanationRu })

  const handleNextLesson = () => setTargetDay((d) => d + 1)

  const handleRegenerate = useCallback(async () => {
    setIsRegenerating(true)
    try {
      const fresh = await fetchOrGenerateLesson(targetDay, prevMistakeCount, true)
      queryClient.setQueryData(['lesson', targetDay], fresh)
    } catch {
      toast.error('Не удалось перегенерировать урок')
    } finally {
      setIsRegenerating(false)
    }
  }, [targetDay, prevMistakeCount, queryClient])

  const dayProgress = getDayProgress(targetDay)
  const allMistakes = Object.values(progress.days).flatMap((d) => d.mistakes ?? [])
  const todayMistakes = getMistakesForDay(targetDay)
  const canGoBack = targetDay > 1
  const canGoForward = targetDay < progress.currentDay

  if (isLoading) {
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
          <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
          <Button onClick={() => refetch()}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  if (!lesson) return null

  const showLessonNav = currentView === 'today' || currentView === 'extra' || currentView === 'mistakes'

  return (
    <div className="min-h-screen bg-reading-bg">
      {showLessonNav && (
        <div className="sticky top-0 z-30 bg-reading-bg/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setTargetDay((d) => Math.max(1, d - 1))} disabled={!canGoBack}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Урок {targetDay}</span>
              <Button
                variant="ghost" size="sm"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="h-6 w-6 p-0 text-muted-foreground/40 hover:text-muted-foreground"
                title="Перегенерировать урок"
              >
                {isRegenerating
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <RefreshCw className="w-3 h-3" />}
              </Button>
            </div>
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
            onAddToGlossary={handleAddToGlossary}
          />
        )}
        {currentView === 'extra' && (
          <ExtraPractice
            lesson={lesson} isCompleted={dayProgress.extraPracticeCompleted}
            onComplete={() => markExtraPracticeCompleted(targetDay)}
            onMistake={handleMistake}
          />
        )}
        {currentView === 'mistakes' && <MistakesView mistakes={allMistakes} />}
        {currentView === 'progress' && (
          <ProgressView progress={progress} onSelectLesson={handleSelectLesson} />
        )}
        {currentView === 'glossary' && (
          <GlossaryView
            glossary={progress.glossary}
            onAddWord={handleAddManualWord}
            onEnrichWord={handleEnrichWord}
            onDeleteWord={handleDeleteWord}
          />
        )}
      </main>

      <Navigation currentView={currentView} onViewChange={setCurrentView} hasMistakes={allMistakes.length > 0} />
    </div>
  )
}

export default Index
