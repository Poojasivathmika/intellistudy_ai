
import React from 'react';
import { QuizResult } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import { CheckCircleIcon, XCircleIcon } from './common/Icons';

interface QuizResultsProps {
    result: QuizResult;
    onRetake: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ result, onRetake }) => {
    const scorePercentage = Math.round((result.score / result.totalQuestions) * 100);
    const scoreColor = scorePercentage >= 70 ? 'text-green-400' : scorePercentage >= 40 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Quiz Results: {result.topic}</h2>
                <p className="text-slate-400 mt-2">Completed on {new Date(result.date).toLocaleString()}</p>
            </div>

            <Card className="mb-8">
                <div className="flex flex-col sm:flex-row justify-around items-center text-center">
                    <div className="mb-4 sm:mb-0">
                        <p className="text-slate-400 text-lg">Your Score</p>
                        <p className={`text-5xl font-bold ${scoreColor}`}>{scorePercentage}%</p>
                    </div>
                    <div className="mb-4 sm:mb-0">
                        <p className="text-slate-400 text-lg">Correct Answers</p>
                        <p className="text-3xl font-bold text-slate-200">{result.score} / {result.totalQuestions}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-lg">Time Taken</p>
                        <p className="text-3xl font-bold text-slate-200">
                            {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                        </p>
                    </div>
                </div>
            </Card>

            <h3 className="text-2xl font-semibold text-white mb-4">Review Your Answers</h3>

            <div className="space-y-4">
                {result.answers.map((answer, index) => (
                    <Card key={index} className={`border-l-4 ${answer.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                        <div className="flex justify-between items-start">
                             <p className="text-lg font-medium text-slate-200 mb-3">{index + 1}. {answer.question.question}</p>
                             {answer.isCorrect 
                                ? <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 ml-4" /> 
                                : <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0 ml-4" />}
                        </div>
                        
                        <p className="text-sm text-slate-400 mb-2">Your answer: <span className={`${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>{answer.userAnswer || 'No answer'}</span></p>
                        {!answer.isCorrect && <p className="text-sm text-slate-400 mb-4">Correct answer: <span className="text-green-400">{answer.question.answer}</span></p>}
                        
                        <details className="bg-slate-900/50 p-3 rounded-md">
                            <summary className="cursor-pointer text-sm text-cyan-400">Explanation</summary>
                            <p className="mt-2 text-sm text-slate-300">{answer.question.explanation}</p>
                        </details>
                    </Card>
                ))}
            </div>

            <div className="mt-8 text-center">
                <Button onClick={onRetake} size="lg">Take Another Quiz</Button>
            </div>
        </div>
    );
};

export default QuizResults;
