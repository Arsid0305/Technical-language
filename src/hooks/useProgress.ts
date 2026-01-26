import { useState, useEffect, useCallback } from 'react';

export interface Mistake {
  day: number;
  taskId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanationRu: string;
  timestamp: number;
}

export interface DayProgress {
  day: number;
  textCompleted: boolean;
  tasksCompleted: boolean;
  extraPracticeCompleted: boolean;
  consolidationCompleted: boolean;
  mistakes: Mistake[];
  completedAt?: number;
}

export interface UserProgress {
  currentDay: number;
  days: Record<number, DayProgress>;
  recognizedActions: string[];
}

const STORAGE_KEY = 'reader-progress';

const defaultProgress: UserProgress = {
  currentDay: 1,
  days: {},
  recognizedActions: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
    return defaultProgress;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }, [progress]);

  const getDayProgress = useCallback((day: number): DayProgress => {
    return progress.days[day] || {
      day,
      textCompleted: false,
      tasksCompleted: false,
      extraPracticeCompleted: false,
      consolidationCompleted: false,
      mistakes: [],
    };
  }, [progress.days]);

  const markTextCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...getDayProgress(day),
          textCompleted: true,
        },
      },
    }));
  }, [getDayProgress]);

  const markTasksCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...getDayProgress(day),
          tasksCompleted: true,
        },
      },
    }));
  }, [getDayProgress]);

  const markExtraPracticeCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...getDayProgress(day),
          extraPracticeCompleted: true,
        },
      },
    }));
  }, [getDayProgress]);

  const markConsolidationCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...getDayProgress(day),
          consolidationCompleted: true,
          completedAt: Date.now(),
        },
      },
      currentDay: Math.max(prev.currentDay, day + 1),
    }));
  }, [getDayProgress]);

  const addMistake = useCallback((day: number, mistake: Omit<Mistake, 'day' | 'timestamp'>) => {
    setProgress((prev) => {
      const dayProgress = getDayProgress(day);
      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: {
            ...dayProgress,
            mistakes: [
              ...dayProgress.mistakes,
              { ...mistake, day, timestamp: Date.now() },
            ],
          },
        },
      };
    });
  }, [getDayProgress]);

  const addRecognizedAction = useCallback((action: string) => {
    setProgress((prev) => {
      if (prev.recognizedActions.includes(action)) {
        return prev;
      }
      return {
        ...prev,
        recognizedActions: [...prev.recognizedActions, action],
      };
    });
  }, []);

  const getTotalTextsCompleted = useCallback(() => {
    return Object.values(progress.days).filter((d) => d.textCompleted).length;
  }, [progress.days]);

  const getTotalDaysCompleted = useCallback(() => {
    return Object.values(progress.days).filter((d) => d.consolidationCompleted).length;
  }, [progress.days]);

  const getMistakesForDay = useCallback((day: number): Mistake[] => {
    return getDayProgress(day).mistakes;
  }, [getDayProgress]);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  return {
    progress,
    getDayProgress,
    markTextCompleted,
    markTasksCompleted,
    markExtraPracticeCompleted,
    markConsolidationCompleted,
    addMistake,
    addRecognizedAction,
    getTotalTextsCompleted,
    getTotalDaysCompleted,
    getMistakesForDay,
    resetProgress,
  };
}
