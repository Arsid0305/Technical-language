import { cn } from '@/lib/utils';
import { BookOpen, RotateCcw, BarChart2, AlertCircle } from 'lucide-react';

export type ViewMode = 'today' | 'extra' | 'progress' | 'mistakes';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  hasMistakes: boolean;
}

export function Navigation({ currentView, onViewChange, hasMistakes }: NavigationProps) {
  const navItems = [
    { id: 'today' as const, label: 'Сегодня', icon: BookOpen },
    { id: 'extra' as const, label: 'Практика', icon: RotateCcw },
    { id: 'mistakes' as const, label: 'Ошибки', icon: AlertCircle, badge: hasMistakes },
    { id: 'progress' as const, label: 'Прогресс', icon: BarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative",
                currentView === id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
              {badge && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-destructive" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
