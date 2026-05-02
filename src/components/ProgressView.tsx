import { UserProgress } from '@/hooks/useProgress';
import { BookOpen, Calendar, Lightbulb } from 'lucide-react';

interface ProgressViewProps {
  progress: UserProgress;
  totalDays: number;
}

function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день завершён';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня завершено';
  return 'дней завершено';
}

function pluralTexts(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'текст прочитан';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'текста прочитано';
  return 'текстов прочитано';
}

export function ProgressView({ progress, totalDays }: ProgressViewProps) {
  const daysCompleted = Object.values(progress.days).filter(d => d.consolidationCompleted).length;
  const textsRead = Object.values(progress.days).filter(d => d.textCompleted).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-reading font-medium text-foreground mb-2">
          Твой прогресс
        </h2>
        <p className="text-muted-foreground">
          Спокойное движение вперёд
        </p>
      </div>

      <div className="grid gap-4">
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-reading font-medium text-foreground">
                {daysCompleted}
              </p>
              <p className="text-sm text-muted-foreground">
                {pluralDays(daysCompleted)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-reading font-medium text-foreground">
                {textsRead}
              </p>
              <p className="text-sm text-muted-foreground">
                {pluralTexts(textsRead)}
              </p>
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
                    <span
                      key={action}
                      className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Доступно дней: {totalDays}</p>
        <p className="mt-1">Текущий день: {progress.currentDay}</p>
      </div>
    </div>
  );
}
