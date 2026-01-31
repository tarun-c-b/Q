import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal } from 'lucide-react';

interface ConsoleProps {
  logs: LogEntry[];
}

export const Console: React.FC<ConsoleProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-black border border-gray-700 rounded-lg overflow-hidden font-mono text-sm shadow-xl">
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
        <Terminal size={16} className="text-gray-400" />
        <span className="text-gray-300 font-semibold">Terminal Output</span>
      </div>
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-1">
        {logs.length === 0 && <span className="text-gray-600 italic">Waiting for input...</span>}
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2">
            <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
            <span
              className={`break-words ${
                log.type === 'error'
                  ? 'text-red-400'
                  : log.type === 'success'
                  ? 'text-green-400'
                  : log.type === 'system'
                  ? 'text-blue-400'
                  : 'text-gray-300'
              }`}
            >
              {log.type === 'system' ? '> ' : ''}{log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};