
import React, { useState } from 'react';
import { getStudyNotes } from '../services/geminiService';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';
import Card from './common/Card';
import { BookOpenIcon } from './common/Icons';

interface SearchResult {
    text: string;
    groundingChunks: any[];
}

const StudySearch: React.FC = () => {
    const [course, setCourse] = useState('');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SearchResult | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!course || !topic) {
            setError("Please enter both course and topic.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await getStudyNotes(course, topic);
            setResult(response);
        } catch (err) {
            setError("Failed to fetch study materials. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatResponse = (text: string) => {
        const sections = text.split(/(?=Tutor Explanation|Study Notes)/i);
        return sections.map((section, index) => {
            if (section.trim()) {
                const titleMatch = section.match(/^(Tutor Explanation|Study Notes)/i);
                const title = titleMatch ? titleMatch[0] : `Section ${index + 1}`;
                const content = titleMatch ? section.substring(title.length).trim() : section.trim();

                const formattedContent = content.split('\n').map((line, i) => {
                    line = line.replace(/^\* /, ''); // Remove leading asterisks
                    if (line.match(/^(\d+\.|[a-z]\.)/)) {
                        return <p key={i} className="ml-4 mb-1">{line}</p>;
                    }
                    if (line.trim() === '') return null;
                    return <p key={i} className="mb-2">{line}</p>;
                }).filter(Boolean);

                return (
                    <div key={index} className="mb-6">
                        <h3 className="text-xl font-semibold text-brand-accent mb-3 border-b-2 border-slate-600 pb-2">{title}</h3>
                        <div className="prose prose-invert max-w-none text-slate-300">{formattedContent}</div>
                    </div>
                );
            }
            return null;
        });
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Course-Specific Study Search</h2>
                <p className="text-slate-400 mt-2">Enter your course and topic to get AI-generated study notes and explanations.</p>
            </div>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
                <Input
                    type="text"
                    id="course"
                    placeholder="e.g., BSc Computer Science"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                    className="flex-grow"
                />
                <Input
                    type="text"
                    id="topic"
                    placeholder="e.g., Data Structures"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    className="flex-grow"
                />
                <Button type="submit" isLoading={loading} disabled={loading}>
                    Search
                </Button>
            </form>

            {loading && <Spinner text="Generating study materials..." />}
            {error && <p className="text-center text-red-500 bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            {formatResponse(result.text)}
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <h3 className="text-xl font-semibold text-brand-accent mb-3 flex items-center gap-2">
                                <BookOpenIcon className="h-6 w-6"/>
                                Sources
                            </h3>
                            {result.groundingChunks.length > 0 ? (
                                <ul className="space-y-3">
                                    {result.groundingChunks.map((chunk, index) => (
                                        <li key={index}>
                                            <a 
                                                href={chunk.web.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-300 block break-words"
                                            >
                                                {chunk.web.title || chunk.web.uri}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-400">No external sources were used.</p>
                            )}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudySearch;
