import React, { useState, useCallback, useEffect } from 'react';
import { QueueVisualizer } from './components/QueueVisualizer';
import { Console } from './components/Console';
import { CodeViewer } from './components/CodeViewer';
import { QueueState, LogEntry } from './types';
import { analyzeCode } from './services/geminiService';
import { USER_C_CODE } from './constants';
import { Play, SkipForward, Info, MapPin, Plus, Trash2, Settings, X, Cpu } from 'lucide-react';

const App: React.FC = () => {
  // -------- State --------
  const [queueSize, setQueueSize] = useState<number>(10); // Default to 10 for better UI fit, though C code says 25
  const [queueState, setQueueState] = useState<QueueState>({
    l: Array(10).fill(null),
    front: -1,
    back: -1,
    size: 10
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // -------- Helpers --------
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp,
      message,
      type
    }]);
  }, []);

  const resetQueue = useCallback((newSize: number) => {
    setQueueState({
      l: Array(newSize).fill(null),
      front: -1,
      back: -1,
      size: newSize
    });
    setLogs([]); // Clear logs on reset? Or keep them. Let's clear to signify a fresh run.
    addLog(`Queue size initialized to ${newSize}`, 'system');
  }, [addLog]);

  // -------- C Logic Implementation --------

  // ENQUEUE(int a)
  const enqueue = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      addLog("Invalid input: Please enter a number", 'error');
      return;
    }

    setQueueState(prev => {
      const { front, back, l, size } = prev;
      
      // C: if (front==-1 && back==-1)
      if (front === -1 && back === -1) {
        const newL = [...l];
        newL[0] = val; // back becomes 0
        addLog(`ENQUEUE(${val}): Queue started. Front=0, Back=0`, 'success');
        setInputValue('');
        return { ...prev, front: 0, back: 0, l: newL };
      }
      // C: else if(back==size-1)
      else if (back === size - 1) {
        addLog("The queue is Full-Overflow", 'error');
        return prev;
      }
      // C: else
      else {
        const newBack = back + 1;
        const newL = [...l];
        newL[newBack] = val;
        addLog(`ENQUEUE(${val}): Element added at index ${newBack}`, 'success');
        setInputValue('');
        return { ...prev, back: newBack, l: newL };
      }
    });
  };

  // DEQUEUE()
  const dequeue = () => {
    setQueueState(prev => {
      const { front, back } = prev;

      // C: if (front==-1)
      if (front === -1) {
        addLog("The Queue is empty-Underflow", 'error');
        return prev;
      }
      // C: else if(front==back)
      else if (front === back) {
        addLog(`DEQUEUE: Removed last element. Resetting pointers.`, 'info');
        // Visual cleanup (optional, C code doesn't explicitly clear the array value, just pointers)
        // We will clear visual value for better UX
        const newL = [...prev.l];
        newL[front] = null; 
        return { ...prev, front: -1, back: -1, l: newL };
      }
      // C: else
      else {
        addLog(`DEQUEUE: Removed element at index ${front}`, 'info');
        // Visual cleanup to match C logical removal (it remains in memory but outside pointers)
        // But for visualizer, let's mark it null to differentiate "garbage"
        // Actually, strict C visualizers sometimes keep the value to show garbage. 
        // Let's keep it null for clarity as per modern visualizer standards.
        const newL = [...prev.l];
        // newL[front] = null; // Un-comment to clear data. Comment out to show "garbage" data staying there.
        // Let's keep data there but the Visualizer component handles the styling of "garbage" (index < front).
        
        return { ...prev, front: front + 1 };
      }
    });
  };

  // LOC()
  const loc = () => {
    const { front, back } = queueState;
    addLog(`LOC: The Front pointer is ${front} and Back pointer ${back}`, 'system');
  };

  // DISPLAY()
  const display = () => {
    const { front, back, l } = queueState;
    if (front === -1) {
      addLog("DISPLAY: The queue is empty", 'info');
    } else {
      const elements = [];
      for (let i = front; i <= back; i++) {
        elements.push(l[i]);
      }
      addLog(`DISPLAY: ${elements.join(' ')}`, 'info');
    }
  };

  // -------- AI Analysis --------
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    addLog("Analyzing code with Gemini AI...", 'system');
    const result = await analyzeCode(USER_C_CODE);
    setAiAnalysis(result);
    setIsAnalyzing(false);
    setShowAnalysisModal(true);
    addLog("Analysis complete.", 'success');
  };

  // Initial Log
  useEffect(() => {
    addLog("System initialized. Set queue size to begin.", 'system');
  }, [addLog]);

  return (
    <div className="h-full flex flex-col md:flex-row bg-gray-900 text-white overflow-hidden">
      
      {/* Left Panel: Visualization & Controls */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 z-10">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Linear Queue Simulator
            </h1>
            <p className="text-gray-400 text-xs mt-1">Based on user C implementation</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
              <span className="text-xs text-gray-400 px-2">Size:</span>
              <input 
                type="number" 
                min="1" 
                max="25"
                value={queueSize}
                onChange={(e) => {
                  const s = parseInt(e.target.value);
                  setQueueSize(s);
                  resetQueue(s);
                }}
                className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button 
                onClick={() => resetQueue(queueSize)}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                title="Reset Queue"
              >
                <Settings size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 bg-[#0f1117] overflow-y-auto relative flex flex-col">
           <div className="flex-1 flex items-center justify-center p-4">
             <QueueVisualizer state={queueState} />
           </div>
        </div>

        {/* Controls Area */}
        <div className="p-6 bg-gray-900 border-t border-gray-800 shrink-0">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Action Group 1: Enqueue */}
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && enqueue()}
              />
              <button
                onClick={enqueue}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Enqueue</span>
              </button>
            </div>

            {/* Action Group 2: Operations */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={dequeue}
                className="bg-gray-800 hover:bg-red-900/30 text-red-400 hover:text-red-300 border border-gray-700 hover:border-red-900 px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Dequeue</span>
              </button>
              
              <button
                onClick={display}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-4 py-3 rounded-lg font-medium transition-all active:scale-95"
                title="Display"
              >
                <SkipForward size={18} />
              </button>

              <button
                onClick={loc}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-4 py-3 rounded-lg font-medium transition-all active:scale-95"
                title="Location (LOC)"
              >
                <MapPin size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Code & Console */}
      <div className="w-full md:w-[450px] flex flex-col border-l border-gray-800 bg-[#0d0e12]">
        <div className="h-1/2 p-4 border-b border-gray-800">
          <CodeViewer onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>
        <div className="h-1/2 p-4">
          <Console logs={logs} />
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/10 p-2 rounded-lg">
                  <Cpu className="text-indigo-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Gemini Code Analysis</h3>
              </div>
              <button 
                onClick={() => setShowAnalysisModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto prose prose-invert prose-sm max-w-none">
               {/* Just simple rendering of markdown text as paragraphs for simplicity, or use a markdown library. 
                   Since I cannot use extra libraries, I will just display whitespace-pre-wrap */}
               <div className="whitespace-pre-wrap text-gray-300 leading-relaxed font-sans">
                 {aiAnalysis}
               </div>
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-800/30 text-right">
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="bg-gray-100 hover:bg-white text-gray-900 px-5 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;