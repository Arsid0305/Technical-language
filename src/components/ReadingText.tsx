import { DailyText } from '@/data/dailyContent';
import { TranslationPopup } from './TranslationPopup';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface ReadingTextProps {
  text: DailyText;
  onFinishReading: () => void;
  isCompleted: boolean;
}

export function ReadingText({ text, onFinishReading, isCompleted }: ReadingTextProps) {
  const paragraphs = text.content.split('\n\n');

  return (
    <div className="relative">
      <TranslationPopup vocabulary={text.vocabulary} />
      
      <article className="reading-text">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            {paragraph}
          </p>
        ))}
      </article>
      
      {!isCompleted && (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-sm text-center">
              Когда закончишь читать, переходи к проверке понимания
            </p>
            <Button
              onClick={onFinishReading}
              className="gap-2"
              size="lg"
            >
              Готово, проверить понимание
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
