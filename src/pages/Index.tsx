import { useState, useEffect } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { getDailyLesson, getTotalDays } from '@/data/dailyContent';
import { Navigation, ViewMode } from '@/components/Navigation';
import { TodayView } from '@/components/TodayView';
import { ExtraPractice } from '@/components/ExtraPractice';
import { ProgressView } from '@/components/ProgressView';
import { MistakesView } from '@/components/MistakesView';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('today');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
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

  const totalDays = getTotalDays();
  const currentDay = selectedDay ?? progress.currentDay;
  const lesson = getDailyLesson(currentDay);
  const dayProgress = getDayProgress(currentDay);
  const todayMistakes = getMistakesForDay(currentDay);

  useEffect(() => {
    // Reset selected day when view changes
    if (currentView === 'today') {
      setSelectedDay(null);
    }
  }, [currentView]);

  const handleMistake = (
    taskId: string,
    question: string,
    userAnswer: string,
    correctAnswer: string,
    explanationRu: string
  ) => {
    addMistake(currentDay, {
      taskId,
      question,
      userAnswer,
      correctAnswer,
      explanationRu,
    });
  };

  const canGoBack = currentDay > 1;
  const canGoForward = currentDay < Math.min(progress.currentDay, totalDays);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-reading-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl font-reading text-foreground mb-2">
            Поздравляем! 🎉
          </p>
          <p className="text-muted-foreground">
            Ты прошёл все доступные дни. Скоро будут новые тексты.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-reading-bg">
      {/* Day navigation for browsing past days */}
      {(currentView === 'today' || currentView === 'extra') && progress.currentDay > 1 && (
        <div className="sticky top-0 z-30 bg-reading-bg/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDay(Math.max(1, currentDay - 1))}
              disabled={!canGoBack}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              День {currentDay} из {Math.min(progress.currentDay, totalDays)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDay(Math.min(progress.currentDay, totalDays, currentDay + 1))}
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
            onMarkTextCompleted={() => markTextCompleted(currentDay)}
            onMarkTasksCompleted={() => markTasksCompleted(currentDay)}
            onMarkConsolidationCompleted={() => markConsolidationCompleted(currentDay)}
            onMistake={handleMistake}
          />
        )}

        {currentView === 'extra' && (
          <ExtraPractice
            lesson={lesson}
            isCompleted={dayProgress.extraPracticeCompleted}
            onComplete={() => markExtraPracticeCompleted(currentDay)}
            onMistake={handleMistake}
          />
        )}

        {currentView === 'mistakes' && (
          <MistakesView mistakes={todayMistakes} day={currentDay} />
        )}

        {currentView === 'progress' && (
          <ProgressView progress={progress} totalDays={totalDays} />
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
