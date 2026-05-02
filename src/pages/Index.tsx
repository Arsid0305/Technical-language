import { useState, useEffect } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { Navigation, ViewMode } from '@/components/Navigation';
import { TodayView } from '@/components/TodayView';
import { ExtraPractice } from '@/components/ExtraPractice';
import { ProgressView } from '@/components/ProgressView';
import { MistakesView } from '@/components/MistakesView';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { DailyLesson } from '@/data/dailyContent';
import { fetchOrGenerateLesson } from '@/lib/lessonService';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('today');
  // targetDay tracks which lesson the user is viewing — does NOT auto-advance
  const [targetDay, setTargetDay] = useState(1);
  const [lesson, setLesson] = useState<DailyLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    progress,
    getDayProgress,
    markTextCompleted,
    markTasksCompleted,
    markConsolidationCompleted,
    markExtraPracticeCompleted,
    addMistake,
    getMistakesForDay,
  } = useProgress();

  // Initialise targetDay from saved progress (once on mount)
  useEffect(() => {
    setTargetDay(progress.currentDay);
  }, []);

  const dayProgress = getDayProgress(targetDay);
  const todayMistakes = getMistakesForDay(targetDay);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setLesson(null);

    const prevMistakeCount = targetDay > 1
      ? (progress.days[targetDay - 1]?.mistakes?.length ?? 0)
      : 0;

    fetchOrGenerateLesson(targetDay, prevMistakeCount)
      .then((l) => { if (!cancelled) { setLesson(l); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [targetDay]);

  useEffect(() => {
    if (currentView === 'today') setTargetDay(progress.currentDay);
  }, [currentView]);

  const handleMistake = (
    taskId: string, question: string, userAnswer: string,
    correctAnswer: string, explanationRu: string
  ) => {
    addMistake(targetDay, { taskId, question, userAnswer, correctAnswer, explanationRu });
  };

  // Called from completion screen — advance to next lesson
  const handleNextLesson = () => setTargetDay((d) => d + 1);

  const canGoBack = targetDay > 1;
  const canGoForward = targetDay < progress.currentDay;

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
    );
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
    );
  }

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-reading-bg">
      {(currentView === 'today' || currentView === 'extra') && (
        <div className="sticky top-0 z-30 bg-reading-bg/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
            <Button
              variant="ghost" size="sm"
              onClick={() => setTargetDay((d) => Math.max(1, d - 1))}
              disabled={!canGoBack}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Урок {targetDay}</span>
            <Button
              variant="ghost" size="sm"
              onClick={() => setTargetDay((d) => Math.min(progress.currentDay, d + 1))}
              disabled={!canGoForward}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {currentView === 'today' && (
          <TodayView
            lesson={lesson}
            dayProgress={dayProgress}
            onMarkTextCompleted={() => markTextCompleted(targetDay)}
            onMarkTasksCompleted={() => markTasksCompleted(targetDay)}
            onMarkConsolidationCompleted={() => markConsolidationCompleted(targetDay)}
            onMistake={handleMistake}
            onNextLesson={handleNextLesson}
          />
        )}
        {currentView === 'extra' && (
          <ExtraPractice
            lesson={lesson}
            isCompleted={dayProgress.extraPracticeCompleted}
            onComplete={() => markExtraPracticeCompleted(targetDay)}
            onMistake={handleMistake}
          />
        )}
        {currentView === 'mistakes' && (
          <MistakesView mistakes={todayMistakes} day={targetDay} />
        )}
        {currentView === 'progress' && (
          <ProgressView progress={progress} />
        )}
      </main>

      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        hasMistakes={todayMistakes.length > 0}
      />
    </div>
  );
};

export default Index;
