import { Task } from '@/data/dailyContent';
import { DailyTasks } from './DailyTasks';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsolidationStepProps {
  tasks: Task[];
  day: number;
  isCompleted: boolean;
  onComplete: () => void;
  onMistake: (taskId: string, question: string, userAnswer: string, correctAnswer: string, explanationRu: string) => void;
  onNextLesson?: () => void;
}

export function ConsolidationStep({
  tasks, day, isCompleted, onComplete, onMistake, onNextLesson,
}: ConsolidationStepProps) {
  if (isCompleted) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-soft mb-6">
          <Star className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-reading font-medium text-foreground mb-2">
          Урок {day} завершён!
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Ты закрепил главные идеи урока. Готов к следующему?
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
          <Check className="w-4 h-4 text-success" />
          <span>Текст прочитан</span>
          <span className="mx-2">•</span>
          <Check className="w-4 h-4 text-success" />
          <span>Понимание проверено</span>
          <span className="mx-2">•</span>
          <Check className="w-4 h-4 text-success" />
          <span>Урок закреплён</span>
        </div>
        {onNextLesson && (
          <Button onClick={onNextLesson} size="lg" className="gap-2">
            Следующий урок
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Star className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-reading font-medium text-foreground mb-2">
          Закрепление урока
        </h2>
        <p className="text-sm text-muted-foreground">
          Последние {tasks.length} вопроса на главные идеи
        </p>
      </div>
      <DailyTasks
        tasks={tasks}
        onComplete={onComplete}
        onMistake={onMistake}
        title="Закрепление"
        subtitle="Основные идеи урока"
      />
    </div>
  );
}
