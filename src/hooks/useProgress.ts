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
  glossary: Record<string, string>;
}

const STORAGE_KEY = 'reader-progress';

const defaultProgress: UserProgress = {
  currentDay: 1,
  days: {},
  recognizedActions: [],
  glossary: {},
};

function getDefaultDayProgress(day: number): DayProgress {
  return {
    day,
    textCompleted: false,
    tasksCompleted: false,
    extraPracticeCompleted: false,
    consolidationCompleted: false,
    mistakes: [],
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultProgress, ...parsed };
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
    return progress.days[day] ?? getDefaultDayProgress(day);
  }, [progress.days]);

  const markTextCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...(prev.days[day] ?? getDefaultDayProgress(day)),
          textCompleted: true,
        },
      },
    }));
  }, []);

  const markTasksCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...(prev.days[day] ?? getDefaultDayProgress(day)),
          tasksCompleted: true,
        },
      },
    }));
  }, []);

  const markExtraPracticeCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...(prev.days[day] ?? getDefaultDayProgress(day)),
          extraPracticeCompleted: true,
        },
      },
    }));
  }, []);

  const markConsolidationCompleted = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...(prev.days[day] ?? getDefaultDayProgress(day)),
          consolidationCompleted: true,
          completedAt: Date.now(),
        },
      },
      currentDay: Math.max(prev.currentDay, day + 1),
    }));
  }, []);

  const addMistake = useCallback((day: number, mistake: Omit<Mistake, 'day' | 'timestamp'>) => {
    setProgress((prev) => {
      const dayProgress = prev.days[day] ?? getDefaultDayProgress(day);
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
  }, []);

  const addToGlossary = useCallback((words: { word: string; translation: string }[]) => {
    setProgress((prev) => {
      const updated = { ...prev.glossary };
      let changed = false;
      for (const { word, translation } of words) {
        const key = word.toLowerCase().trim();
        if (!updated[key]) {
          updated[key] = translation;
          changed = true;
        }
      }
      if (!changed) return prev;
      return { ...prev, glossary: updated };
    });
  }, []);

  const addRecognizedAction = useCallback((action: string) => {
    setProgress((prev) => {
      if (prev.recognizedActions.includes(action)) return prev;
      return { ...prev, recognizedActions: [...prev.recognizedActions, action] };
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
    addToGlossary,
    addRecognizedAction,
    getTotalTextsCompleted,
    getTotalDaysCompleted,
    getMistakesForDay,
    resetProgress,
  };
}
