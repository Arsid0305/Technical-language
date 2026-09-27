import { useState, useEffect, useRef } from 'react';
import { DailyLesson } from '@/data/dailyContent';
import { DayProgress } from '@/hooks/useProgress';
import { DayHeader } from './DayHeader';
import { ReadingText } from './ReadingText';
import { DailyTasks } from './DailyTasks';
import { ConsolidationStep } from './ConsolidationStep';

type Stage = 'reading' | 'tasks' | 'consolidation' | 'complete';

interface TodayViewProps {
  lesson: DailyLesson;
  dayProgress: DayProgress;
  onMarkTextCompleted: () => void;
  onMarkTasksCompleted: () => void;
  onMarkConsolidationCompleted: () => void;
  onMistake: (taskId: string, question: string, userAnswer: string, correctAnswer: string, explanationRu: string) => void;
  onNextLesson: () => void;
  onAddToGlossary?: (words: { word: string; translation: string }[]) => void;
}

export function TodayView({
  lesson, dayProgress,
  onMarkTextCompleted, onMarkTasksCompleted, onMarkConsolidationCompleted,
  onMistake, onNextLesson, onAddToGlossary,
}: TodayViewProps) {
  const [stage, setStage] = useState<Stage>(() => {
    if (dayProgress.consolidationCompleted) return 'complete';
    if (dayProgress.tasksCompleted) return 'consolidation';
    if (dayProgress.textCompleted) return 'tasks';
    return 'reading';
  });

  // Повтор пройденного урока: пока идёт разбор, ошибка меняет dayProgress,
  // и эффект ниже выбрасывал обратно на «завершено». Флаг это останавливает.
  // Сбрасывать не нужно — Index монтирует TodayView заново на каждый урок (key={targetDay}).
  const stagePinned = useRef(false);

  useEffect(() => {
    if (stagePinned.current) return;
    if (dayProgress.consolidationCompleted) setStage('complete');
    else if (dayProgress.tasksCompleted) setStage('consolidation');
    else if (dayProgress.textCompleted) setStage('tasks');
  }, [dayProgress]);

  const handleFinishReading = () => { onMarkTextCompleted(); setStage('tasks'); };
  const handleTasksComplete = () => { onMarkTasksCompleted(); setStage('consolidation'); };
  const handleConsolidationComplete = () => { onMarkConsolidationCompleted(); setStage('complete'); };

  return (
    <div className="pb-8">
      <DayHeader text={lesson.text} />

      {stage === 'reading' && (
        <ReadingText
          text={lesson.text}
          onFinishReading={handleFinishReading}
          isCompleted={dayProgress.textCompleted}
          onAddToGlossary={onAddToGlossary}
        />
      )}

      {stage === 'tasks' && (
        <div className="animate-fade-in">
          <div className="mb-6">
            <h2 className="text-xl font-reading font-medium text-foreground mb-2">
              Проверка понимания
            </h2>
            <p className="text-sm text-muted-foreground">
              Несколько вопросов о том, что делает система
            </p>
          </div>
          <DailyTasks
            tasks={lesson.tasks}
            onComplete={handleTasksComplete}
            onMistake={onMistake}
            title="Основные вопросы"
          />
        </div>
      )}

      {stage === 'consolidation' && (
        <ConsolidationStep
          tasks={lesson.consolidation}
          day={lesson.text.day}
          isCompleted={false}
          onComplete={handleConsolidationComplete}
          onMistake={onMistake}
        />
      )}

      {stage === 'complete' && (
        <>
          <ReadingText
            text={lesson.text}
            onFinishReading={() => {}}
            isCompleted={true}
            onAddToGlossary={onAddToGlossary}
          />
          <div className="mt-12 border-t border-border">
            <ConsolidationStep
              tasks={lesson.consolidation}
              day={lesson.text.day}
              isCompleted={true}
              onComplete={() => {}}
              onMistake={onMistake}
              onNextLesson={onNextLesson}
              onRepeat={() => { stagePinned.current = true; setStage('tasks'); }}
            />
          </div>
        </>
      )}
    </div>
  );
}
