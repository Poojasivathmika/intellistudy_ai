
import React from 'react';
// FIX: Import BookOpenIcon to resolve 'Cannot find name' error.
import { BrainCircuitIcon, ClipboardListIcon, LineChartIcon, BookOpenIcon } from './common/Icons';

type View = 'search' | 'test' | 'analytics';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  view: View;
  activeView: View;
  onClick: (view: View) => void;
  icon: React.ReactNode;
}> = ({ label, view, activeView, onClick, icon }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
        isActive
          ? 'bg-brand-primary text-white shadow-md'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};


const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  return (
    <header className="bg-brand-card shadow-lg sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BrainCircuitIcon className="h-8 w-8 text-brand-accent" />
            <h1 className="ml-3 text-2xl font-bold text-white">IntelliStudy AI</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NavButton
              label="Study Search"
              view="search"
              activeView={activeView}
              onClick={setActiveView}
              icon={<BookOpenIcon className="h-5 w-5" />}
            />
            <NavButton
              label="Mock Tests"
              view="test"
              activeView={activeView}
              onClick={setActiveView}
              icon={<ClipboardListIcon className="h-5 w-5" />}
            />
            <NavButton
              label="Analytics"
              view="analytics"
              activeView={activeView}
              onClick={setActiveView}
              icon={<LineChartIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;