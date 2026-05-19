import { useState } from 'react';
import { Task } from '@/data/dailyContent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskQuestionProps {
  task: Task;
  onAnswer: (correct: boolean, userAnswer: string, correctAnswer: string) => void;
  showSoftPass?: boolean;
}

export function TaskQuestion({ task, onAnswer, showSoftPass = true }: TaskQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (task.type === 'meaning' && selectedOption !== null) {
      const correct = selectedOption === task.correctIndex;
      setIsCorrect(correct);
      setShowResult(true);
    } else if (task.type === 'reflection' && reflectionText.trim()) {
      // Reflections are always "soft pass"
      setIsCorrect(true);
      setShowResult(true);
    }
  };

  const handleContinue = () => {
    if (task.type === 'meaning') {
      onAnswer(
        isCorrect,
        task.options?.[selectedOption!] || '',
        task.options?.[task.correctIndex!] || ''
      );
    } else {
      onAnswer(true, reflectionText, '');
    }
  };

  if (task.type === 'meaning' && (!task.options || task.options.length === 0)) {
    return (
      <div className="p-4 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
        Вопрос загрузился без вариантов ответа. Перегенерируй урок кнопкой ↺.
      </div>
    )
  }

  if (task.type === 'reflection') {
    return (
      <div className="space-y-4 animate-fade-in">
        <p className="text-lg font-reading text-foreground">{task.question}</p>
        {task.questionRu && (
          <p className="text-sm text-muted-foreground">{task.questionRu}</p>
        )}
        
        {!showResult ? (
          <>
            <Textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Напиши свои мысли..."
              className="min-h-[100px] font-reading"
            />
            <Button
              onClick={handleSubmit}
              disabled={!reflectionText.trim()}
              className="w-full"
            >
              Отправить
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-success-soft border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-success" />
                <span className="font-medium text-success">Отлично!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Размышление — важная часть понимания. Спасибо за твои мысли.
              </p>
            </div>
            <Button onClick={handleContinue} className="w-full gap-2">
              Продолжить
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-lg font-reading text-foreground">{task.question}</p>
      
      <div className="space-y-2">
        {task.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={showResult}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-all duration-200",
              "hover:border-primary/50 hover:bg-muted/50",
              selectedOption === index && !showResult && "border-primary bg-primary/5",
              showResult && index === task.correctIndex && "border-success bg-success-soft",
              showResult && selectedOption === index && index !== task.correctIndex && "border-destructive bg-error-soft",
              showResult && selectedOption !== index && index !== task.correctIndex && "opacity-50"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-reading">{option}</span>
              {showResult && index === task.correctIndex && (
                <Check className="w-5 h-5 text-success" />
              )}
              {showResult && selectedOption === index && index !== task.correctIndex && (
                <X className="w-5 h-5 text-destructive" />
              )}
            </div>
          </button>
        ))}
      </div>

      {!showResult ? (
        <Button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full"
        >
          Проверить
        </Button>
      ) : (
        <div className="space-y-4">
          {!isCorrect && task.explanationRu && (
            <div className="p-4 rounded-lg bg-muted border border-border">
              <p className="text-sm font-medium text-foreground mb-1">Объяснение:</p>
              <p className="text-sm text-muted-foreground">{task.explanationRu}</p>
            </div>
          )}
          {isCorrect && (
            <div className="p-4 rounded-lg bg-success-soft border border-success/20">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                <span className="font-medium text-success">Правильно!</span>
              </div>
            </div>
          )}
          <Button onClick={handleContinue} className="w-full gap-2">
            Продолжить
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
