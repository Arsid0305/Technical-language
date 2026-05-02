export interface DailyText {
  id: string;
  day: number;
  focus: string;
  focusRu: string;
  title: string;
  content: string;
  vocabulary: { word: string; translation: string }[];
}

export interface Task {
  id: string;
  type: 'meaning' | 'reflection';
  question: string;
  questionRu?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  explanationRu?: string;
}

export interface DailyLesson {
  text: DailyText;
  tasks: Task[];
  extraPractice: Task[];
  consolidation: Task[];
}
