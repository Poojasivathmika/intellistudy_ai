
import React, { useState } from 'react';
import Header from './components/Header';
import StudySearch from './components/StudySearch';
import MockTestGenerator from './components/MockTestGenerator';
import ProgressAnalytics from './components/ProgressAnalytics';
import { QuizResult } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { BrainCircuitIcon, ClipboardListIcon, LineChartIcon } from './components/common/Icons';

type View = 'search' | 'test' | 'analytics';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('search');
  const [analyticsData, setAnalyticsData] = useLocalStorage<QuizResult[]>('quizAnalytics', []);

  const addQuizResult = (result: QuizResult) => {
    setAnalyticsData(prevData => [...prevData, result]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'search':
        return <StudySearch />;
      case 'test':
        return <MockTestGenerator addQuizResult={addQuizResult} />;
      case 'analytics':
        return <ProgressAnalytics data={analyticsData} />;
      default:
        return <StudySearch />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light font-sans">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-brand-card shadow-lg rounded-2xl p-6 md:p-8 min-h-[calc(100vh-150px)]">
          {renderView()}
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Powered by IntelliStudy AI</p>
      </footer>
    </div>
  );
};

export default App;
