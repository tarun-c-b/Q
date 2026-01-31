import React from 'react';
import { QueueState } from '../types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface QueueVisualizerProps {
  state: QueueState;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ state }) => {
  const { l, front, back, size } = state;

  return (
    <div className="w-full overflow-x-auto pb-12 pt-8 px-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
      <div className="flex gap-2 min-w-max mx-auto justify-start md:justify-center">
        {l.map((val, index) => {
          // Determine cell status
          const isOccupied = front !== -1 && index >= front && index <= back;
          const isGarbage = front !== -1 && index < front;
          const isFuture = index > back && front !== -1;
          const isEmptyQueue = front === -1 && back === -1;
          
          let cellClass = "bg-gray-800 border-gray-600 text-gray-500"; // Default empty
          if (isOccupied) cellClass = "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] transform -translate-y-1";
          if (isGarbage) cellClass = "bg-red-900/20 border-red-900/50 text-gray-600 opacity-50"; 
          if (isEmptyQueue) cellClass = "bg-gray-800 border-gray-600 text-gray-500";

          return (
            <div key={index} className="flex flex-col items-center gap-2 relative group">
              {/* Index Label */}
              <span className="text-[10px] text-gray-500 font-mono mb-1">{index}</span>
              
              {/* Cell */}
              <div 
                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-lg font-mono text-lg font-bold transition-all duration-300 ${cellClass}`}
              >
                {val ?? ''}
              </div>

              {/* Pointers */}
              <div className="absolute top-full mt-2 h-12 w-full flex flex-col items-center">
                {front === index && (
                  <div className="absolute top-0 flex flex-col items-center animate-bounce text-green-400 z-10">
                    <ArrowUp size={16} />
                    <span className="text-[10px] font-bold bg-green-900/80 px-1 rounded mt-0.5">FRONT</span>
                  </div>
                )}
                {back === index && (
                  <div className={`absolute flex flex-col items-center text-orange-400 z-10 transition-all duration-300 ${front === index ? 'top-8' : 'top-0 animate-bounce'}`}>
                    <ArrowUp size={16} />
                    <span className="text-[10px] font-bold bg-orange-900/80 px-1 rounded mt-0.5">BACK</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-8 flex gap-6 justify-center text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-600 rounded"></div>
          <span>Active Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-900/20 border border-red-900/50 rounded"></div>
          <span>Dequeued Space</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-800 border border-gray-600 rounded"></div>
          <span>Empty</span>
        </div>
      </div>
    </div>
  );
};