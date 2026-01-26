import { useState } from 'react';
import { Task } from '@/data/dailyContent';
import { TaskQuestion } from './TaskQuestion';
import { Progress } from '@/components/ui/progress';

interface DailyTasksProps {
  tasks: Task[];
  onComplete: () => void;
  onMistake: (taskId: string, question: string, userAnswer: string, correctAnswer: string, explanationRu: string) => void;
  title: string;
  subtitle?: string;
}

export function DailyTasks({ tasks, onComplete, onMistake, title, subtitle }: DailyTasksProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = ((currentIndex) / tasks.length) * 100;

  const handleAnswer = (correct: boolean, userAnswer: string, correctAnswer: string) => {
    const task = tasks[currentIndex];
    
    if (!correct && task.explanationRu) {
      onMistake(task.id, task.question, userAnswer, correctAnswer, task.explanationRu);
    }
    
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{title}</span>
          <span>{currentIndex + 1} / {tasks.length}</span>
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        <Progress value={progress} className="h-1" />
      </div>

      <TaskQuestion
        key={tasks[currentIndex].id}
        task={tasks[currentIndex]}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
