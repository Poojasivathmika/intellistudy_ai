
export enum QuestionType {
  MCQ = 'Multiple Choice',
  ShortAnswer = 'Short Answer',
  TrueFalse = 'True/False'
}

export interface QuizQuestion {
  question: string;
  type: QuestionType;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface UserAnswer {
  question: string;
  userAnswer: string;
}

export interface QuizResult {
  topic: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  date: string; // ISO string
  answers: {
    question: QuizQuestion;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}
