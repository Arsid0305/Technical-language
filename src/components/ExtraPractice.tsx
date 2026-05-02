import { useState } from 'react';
import { DailyLesson } from '@/data/dailyContent';
import { DailyTasks } from './DailyTasks';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check } from 'lucide-react';

interface ExtraPracticeProps {
  lesson: DailyLesson;
  isCompleted: boolean;
  onComplete: () => void;
  onMistake: (taskId: string, question: string, userAnswer: string, correctAnswer: string, explanationRu: string) => void;
}

export function ExtraPractice({ lesson, isCompleted, onComplete, onMistake }: ExtraPracticeProps) {
  const [started, setStarted] = useState(false);
  const [restarted, setRestarted] = useState(false);

  const handleRestart = () => {
    setRestarted(true);
    setStarted(false);
  };

  if (isCompleted && !restarted) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-soft mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-xl font-reading font-medium text-foreground mb-2">
          Дополнительная практика завершена!
        </h2>
        <p className="text-muted-foreground mb-6">
          Ты проработал словарь дня {lesson.text.day}
        </p>
        <Button variant="outline" onClick={handleRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Начать заново
        </Button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <RotateCcw className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-reading font-medium text-foreground mb-2">
          Дополнительная практика
        </h2>
        <p className="text-muted-foreground mb-2">
          День {lesson.text.day}: {lesson.text.title}
        </p>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          {lesson.extraPractice.length} вопросов на словарь и понимание.
          Используется только то, что ты уже видел в тексте.
        </p>
        <Button onClick={() => setStarted(true)} size="lg">
          Начать практику
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <DailyTasks
        tasks={lesson.extraPractice}
        onComplete={onComplete}
        onMistake={onMistake}
        title="Дополнительная практика"
        subtitle="Вопросы по словарю из текста"
      />
    </div>
  );
}
