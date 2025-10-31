
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, QuestionType, QuizResult } from '../types';
import Quiz from './Quiz';
import Input from './common/Input';
import Select from './common/Select';
import Button from './common/Button';
import Spinner from './common/Spinner';

interface MockTestGeneratorProps {
    addQuizResult: (result: QuizResult) => void;
}

const MockTestGenerator: React.FC<MockTestGeneratorProps> = ({ addQuizResult }) => {
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('Medium');
    const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([QuestionType.MCQ]);
    const [timeLimit, setTimeLimit] = useState(10); // in minutes

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);

    const handleTypeChange = (type: QuestionType) => {
        setQuestionTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleGenerateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || numQuestions <= 0 || questionTypes.length === 0) {
            setError("Please fill all fields and select at least one question type.");
            return;
        }
        setLoading(true);
        setError(null);
        setQuizQuestions(null);
        try {
            const questions = await generateQuiz(topic, numQuestions, questionTypes, difficulty);
            setQuizQuestions(questions);
        } catch (err) {
            setError("Failed to generate the quiz. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (quizQuestions) {
        return <Quiz 
                 questions={quizQuestions} 
                 timeLimit={timeLimit * 60} 
                 topic={topic}
                 addQuizResult={addQuizResult}
                 onRetake={() => setQuizQuestions(null)} 
               />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Mock Test Generator</h2>
                <p className="text-slate-400 mt-2">Create a custom quiz to test your knowledge on any topic.</p>
            </div>
            
            <form onSubmit={handleGenerateQuiz} className="space-y-6">
                <Input
                    label="Topic"
                    id="topic"
                    type="text"
                    placeholder="e.g., React Hooks"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                        label="Number of Questions"
                        id="numQuestions"
                        type="number"
                        min="1"
                        max="20"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                        required
                    />
                    <Select
                        label="Difficulty"
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </Select>
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Question Types</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-700/50 p-4 rounded-lg">
                        {Object.values(QuestionType).map(type => (
                            <label key={type} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-slate-500 bg-slate-800 text-brand-primary focus:ring-brand-primary"
                                    checked={questionTypes.includes(type)}
                                    onChange={() => handleTypeChange(type)}
                                />
                                <span className="text-slate-200">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <Input
                    label="Time Limit (minutes, 0 for no limit)"
                    id="timeLimit"
                    type="number"
                    min="0"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                />
                
                {error && <p className="text-red-500 bg-red-900/50 p-3 rounded-md">{error}</p>}
                
                <div className="pt-4">
                    <Button type="submit" isLoading={loading} disabled={loading} className="w-full" size="lg">
                        Generate Quiz
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MockTestGenerator;
