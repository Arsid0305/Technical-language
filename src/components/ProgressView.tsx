import { UserProgress } from '@/hooks/useProgress';
import { BookOpen, Calendar, Lightbulb, CheckCircle2, Circle, ChevronRight } from 'lucide-react';

interface ProgressViewProps {
  progress: UserProgress;
  onSelectLesson?: (day: number) => void;
}

function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'урок завершён';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'урока завершено';
  return 'уроков завершено';
}

function pluralTexts(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'текст прочитан';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'текста прочитано';
  return 'текстов прочитано';
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function ProgressView({ progress, onSelectLesson }: ProgressViewProps) {
  const daysCompleted = Object.values(progress.days).filter((d) => d.consolidationCompleted).length;
  const textsRead = Object.values(progress.days).filter((d) => d.textCompleted).length;

  const lessonDays = Array.from({ length: progress.currentDay }, (_, i) => i + 1).reverse();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-reading font-medium text-foreground mb-2">
          Твой прогресс
        </h2>
        <p className="text-muted-foreground">Спокойное движение вперёд</p>
      </div>

      <div className="grid gap-4">
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-reading font-medium text-foreground">{daysCompleted}</p>
              <p className="text-sm text-muted-foreground">{pluralDays(daysCompleted)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-reading font-medium text-foreground">{textsRead}</p>
              <p className="text-sm text-muted-foreground">{pluralTexts(textsRead)}</p>
            </div>
          </div>
        </div>

        {progress.recognizedActions.length > 0 && (
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-lg font-reading font-medium text-foreground mb-2">
                  Освоенные действия
                </p>
                <div className="flex flex-wrap gap-2">
                  {progress.recognizedActions.map((action) => (
                    <span key={action} className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground">
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-reading font-medium text-foreground mb-3">Уроки</h3>
        <div className="space-y-2">
          {lessonDays.map((day) => {
            const dp = progress.days[day];
            const isCompleted = dp?.consolidationCompleted;
            const isInProgress = dp && !isCompleted && (dp.textCompleted || dp.tasksCompleted || dp.extraPracticeCompleted);
            const isCurrent = day === progress.currentDay;
            const mistakeCount = dp?.mistakes?.length ?? 0;

            return (
              <button
                key={day}
                onClick={() => onSelectLesson?.(day)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isCompleted ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  {isCompleted
                    ? <CheckCircle2 className="w-5 h-5 text-primary" />
                    : <Circle className="w-5 h-5 text-muted-foreground" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">Урок {day}</span>
                    {isCurrent && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">сейчас</span>
                    )}
                    {isCompleted && dp.completedAt && (
                      <span className="text-xs text-muted-foreground">{formatDate(dp.completedAt)}</span>
                    )}
                  </div>
                  {isInProgress && (
                    <p className="text-xs text-muted-foreground mt-0.5">В процессе</p>
                  )}
                </div>
                {mistakeCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium shrink-0">
                    {mistakeCount} {mistakeCount === 1 ? 'ошибка' : mistakeCount < 5 ? 'ошибки' : 'ошибок'}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
