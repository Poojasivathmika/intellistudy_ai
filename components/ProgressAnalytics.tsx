
import React from 'react';
import { QuizResult } from '../types';
import Card from './common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ProgressAnalyticsProps {
  data: QuizResult[];
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Progress Analytics</h2>
                <p className="text-slate-400">No quiz data available yet. Complete a mock test to see your progress!</p>
            </div>
        );
    }
    
    const averageScore = data.reduce((acc, r) => acc + (r.score / r.totalQuestions), 0) / data.length * 100;
    const averageTime = data.reduce((acc, r) => acc + r.timeTaken, 0) / data.length;
    
    const scoreOverTime = data.map(r => ({
        date: new Date(r.date).toLocaleDateString(),
        score: Math.round((r.score / r.totalQuestions) * 100),
    }));

    const topicPerformance = data.reduce((acc, result) => {
        if (!acc[result.topic]) {
            acc[result.topic] = { scores: [], count: 0 };
        }
        acc[result.topic].scores.push(result.score / result.totalQuestions * 100);
        acc[result.topic].count++;
        return acc;
    }, {} as Record<string, { scores: number[]; count: number }>);
    
    const topicChartData = Object.entries(topicPerformance).map(([topic, { scores }]) => ({
        topic,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));

    const weakTopics = topicChartData.filter(t => t.averageScore < 60).sort((a, b) => a.averageScore - b.averageScore);

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="p-2 bg-slate-700 border border-slate-600 rounded-md shadow-lg text-sm">
            <p className="label text-slate-300">{`${label}`}</p>
            <p className="intro text-brand-accent">{`${payload[0].name}: ${payload[0].value}%`}</p>
          </div>
        );
      }
      return null;
    };
    
    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Progress Analytics</h2>
                <p className="text-slate-400 mt-2">Track your performance and identify areas for improvement.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <h3 className="text-slate-400">Average Score</h3>
                    <p className="text-4xl font-bold text-brand-accent">{averageScore.toFixed(1)}%</p>
                </Card>
                <Card>
                    <h3 className="text-slate-400">Average Time/Quiz</h3>
                    <p className="text-4xl font-bold text-brand-accent">{Math.floor(averageTime / 60)}m {Math.round(averageTime % 60)}s</p>
                </Card>
                <Card>
                    <h3 className="text-slate-400">Total Quizzes Taken</h3>
                    <p className="text-4xl font-bold text-brand-accent">{data.length}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-semibold mb-4 text-white">Score Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={scoreOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" unit="%" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="text-xl font-semibold mb-4 text-white">Performance by Topic</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topicChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="topic" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" unit="%" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="averageScore" fill="#0891b2" name="Average Score" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            {weakTopics.length > 0 &&
                <Card className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-white">Topics to Focus On</h3>
                    <ul className="space-y-2">
                       {weakTopics.map(({ topic, averageScore }) => (
                           <li key={topic} className="flex justify-between p-3 bg-slate-700/50 rounded-md">
                               <span className="text-slate-300">{topic}</span>
                               <span className="font-semibold text-red-400">{averageScore.toFixed(1)}% avg.</span>
                           </li>
                       ))}
                    </ul>
                </Card>
            }
        </div>
    );
};

export default ProgressAnalytics;
