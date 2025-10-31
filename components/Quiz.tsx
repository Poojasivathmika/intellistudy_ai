
import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QuestionType, UserAnswer, QuizResult } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import QuizResults from './QuizResults';

interface QuizProps {
  questions: QuizQuestion[];
  timeLimit: number; // in seconds
  topic: string;
  addQuizResult: (result: QuizResult) => void;
  onRetake: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, timeLimit, topic, addQuizResult, onRetake }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (timeLimit > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimit]);

  const handleAnswerChange = (answer: string) => {
    const updatedAnswers = [...userAnswers];
    const existingAnswerIndex = updatedAnswers.findIndex(a => a.question === questions[currentQuestionIndex].question);
    if (existingAnswerIndex > -1) {
      updatedAnswers[existingAnswerIndex].userAnswer = answer;
    } else {
      updatedAnswers.push({ question: questions[currentQuestionIndex].question, userAnswer: answer });
    }
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuizFinished(true);
    
    let score = 0;
    const detailedAnswers = questions.map(q => {
      const userAnswerObj = userAnswers.find(a => a.question === q.question);
      const userAnswer = userAnswerObj ? userAnswerObj.userAnswer : "";
      const isCorrect = userAnswer.toLowerCase().trim() === q.answer.toLowerCase().trim();
      if (isCorrect) score++;
      return { question: q, userAnswer, isCorrect };
    });
    
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    const result: QuizResult = {
      topic,
      score,
      totalQuestions: questions.length,
      timeTaken,
      date: new Date().toISOString(),
      answers: detailedAnswers
    };
    
    setQuizResult(result);
    addQuizResult(result);
  };

  if (quizFinished && quizResult) {
    return <QuizResults result={quizResult} onRetake={onRetake} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentUserAnswer = userAnswers.find(a => a.question === currentQuestion.question)?.userAnswer || '';

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Quiz: {topic}</h2>
        {timeLimit > 0 && <div className="text-lg font-mono bg-slate-700 px-3 py-1 rounded-md text-brand-accent">{formatTime(timeLeft)}</div>}
      </div>
      <div className="bg-slate-900/50 h-2 rounded-full mb-6">
        <div className="bg-brand-primary h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
      </div>
      
      <Card>
        <p className="text-slate-400 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h3 className="text-xl font-semibold mb-6 text-slate-100">{currentQuestion.question}</h3>
        
        <div className="space-y-4">
          {currentQuestion.type === QuestionType.MCQ && currentQuestion.options?.map((option, index) => (
            <label key={index} className="flex items-center p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors duration-200">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={currentUserAnswer === option}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-slate-500 bg-slate-800"
              />
              <span className="ml-4 text-slate-200">{option}</span>
            </label>
          ))}
          {currentQuestion.type === QuestionType.TrueFalse && ['True', 'False'].map((option, index) => (
            <label key={index} className="flex items-center p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors duration-200">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={currentUserAnswer === option}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-slate-500 bg-slate-800"
              />
              <span className="ml-4 text-slate-200">{option}</span>
            </label>
          ))}
          {currentQuestion.type === QuestionType.ShortAnswer && (
            <textarea
              value={currentUserAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-brand-light placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Your answer..."
            />
          )}
        </div>
      </Card>

      <div className="flex justify-between mt-8">
        <Button onClick={handlePrev} disabled={currentQuestionIndex === 0} variant="secondary">
          Previous
        </Button>
        {currentQuestionIndex === questions.length - 1 ? (
          <Button onClick={handleFinishQuiz}>Finish Quiz</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
