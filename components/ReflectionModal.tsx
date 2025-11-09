
import React, { useState } from 'react';
import { getDailyReflection } from '../services/geminiService';
import { XIcon } from './Icons';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowScore: number;
  tasksCompleted: number;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose, flowScore, tasksCompleted }) => {
  const [reflectionText, setReflectionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; mantra: string } | null>(null);

  const handleSubmit = async () => {
    if (!reflectionText.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const dailySummary = `Today I completed ${tasksCompleted} tasks and achieved a flow score of ${flowScore}. I felt: ${reflectionText}`;
      const reflectionResult = await getDailyReflection(dailySummary);
      setResult(reflectionResult);
    } catch (error) {
      console.error("Failed to get reflection:", error);
      setResult({ summary: "Could not generate reflection.", mantra: "Every step is progress." });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    setReflectionText('');
    setResult(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300" onClick={handleClose}>
      <div className="bg-gray-800/80 border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-lg text-white relative" onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">End-of-Day Reflection</h2>
        
        {!result ? (
          <>
            <p className="text-center text-gray-300 mb-6">How did your day feel? Gently reflect on your focus and flow.</p>
            <textarea
              value={reflectionText}
              onChange={e => setReflectionText(e.target.value)}
              placeholder="I felt productive when..."
              className="w-full h-32 p-3 bg-gray-900/50 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !reflectionText.trim()}
              className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Create My Mantra'}
            </button>
          </>
        ) : (
          <div className="text-center animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Today's Summary</h3>
            <p className="text-gray-200 mb-6 italic">"{result.summary}"</p>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Tomorrow's Mantra</h3>
            <p className="text-2xl font-bold text-purple-200">"{result.mantra}"</p>
            <button
              onClick={handleClose}
              className="w-full mt-8 py-3 bg-gray-600/50 hover:bg-gray-600/80 rounded-lg font-semibold transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
