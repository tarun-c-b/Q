import React from 'react';
import { USER_C_CODE } from '../constants';
import { Code, Bot } from 'lucide-react';

interface CodeViewerProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ onAnalyze, isAnalyzing }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border border-gray-700 rounded-lg overflow-hidden shadow-xl">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-blue-400" />
          <span className="text-gray-300 font-semibold">main.c</span>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Bot size={14} />
          {isAnalyzing ? 'Analyzing...' : 'Ask AI Explain'}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 text-xs md:text-sm font-mono leading-relaxed relative">
        <pre className="text-gray-300">
          <code>{USER_C_CODE}</code>
        </pre>
      </div>
    </div>
  );
};