import { Mistake } from '@/hooks/useProgress';
import { AlertCircle } from 'lucide-react';

interface MistakesViewProps {
  mistakes: Mistake[];
  day: number;
}

export function MistakesView({ mistakes, day }: MistakesViewProps) {
  if (mistakes.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-soft mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-muted-foreground">
          Сегодня без ошибок! Отличная работа.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Ошибки за день {day}</span>
      </div>
      
      <div className="space-y-4">
        {mistakes.map((mistake, index) => (
          <div
            key={`${mistake.taskId}-${index}`}
            className="p-4 rounded-lg border border-border bg-card"
          >
            <p className="font-reading text-foreground mb-3">{mistake.question}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-destructive font-medium shrink-0">Твой ответ:</span>
                <span className="text-muted-foreground">{mistake.userAnswer}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-success font-medium shrink-0">Правильно:</span>
                <span className="text-muted-foreground">{mistake.correctAnswer}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Объяснение: </span>
                {mistake.explanationRu}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
