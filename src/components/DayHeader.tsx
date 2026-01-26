import { DailyText } from '@/data/dailyContent';

interface DayHeaderProps {
  text: DailyText;
}

export function DayHeader({ text }: DayHeaderProps) {
  return (
    <header className="mb-8 pb-8 border-b border-border animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span className="px-2 py-1 rounded-md bg-muted">День {text.day}</span>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-reading font-medium text-foreground mb-4 leading-tight">
        {text.title}
      </h1>
      
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-foreground mb-1">{text.focus}</p>
        <p className="text-sm text-muted-foreground">{text.focusRu}</p>
      </div>
    </header>
  );
}
