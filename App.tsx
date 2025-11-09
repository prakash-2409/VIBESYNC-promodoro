import React, { useState, useCallback, useEffect } from 'react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskManager } from './components/TaskManager';
import { AmbiencePlayer } from './components/AmbiencePlayer';
import { VisualFocusRoom } from './components/VisualFocusRoom';
import { ReflectionModal } from './components/ReflectionModal';
import { FlowScore } from './components/FlowScore';
import type { Task, Theme, AmbienceTrack, Mood, FlowRecord } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AMBIENCE_TRACKS } from './constants';
import { getMoodSuggestion } from './services/geminiService';
import { BrainCircuitIcon, MoonIcon, SunIcon, WandSparklesIcon, SmileIcon, MehIcon, FrownIcon } from './components/Icons';

export default function App() {
  const [theme, setTheme] = useLocalStorage<Theme>('vibesync-theme', 'calm');
  const [tasks, setTasks] = useLocalStorage<Task[]>('vibesync-tasks', []);
  const [flowHistory, setFlowHistory] = useLocalStorage<FlowRecord[]>('vibesync-flow-history', []);
  const [completedCycles, setCompletedCycles] = useLocalStorage<number>('vibesync-completed-cycles', 0);
  const [mood, setMood] = useLocalStorage<Mood>('vibesync-mood', 'neutral');
  const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AmbienceTrack>(AMBIENCE_TRACKS[0]);
  const [isAIAdapting, setIsAIAdapting] = useState(false);

  const totalFlowScore = flowHistory.reduce((sum, record) => sum + record.score, 0);

  const handleCycleComplete = useCallback(() => {
    setCompletedCycles(prev => {
        const newCount = prev + 1;
        if (newCount > 0 && newCount % 5 === 0) {
            console.log("5 cycles completed! Time for a longer break.");
        }
        return newCount;
    });
    const newRecord: FlowRecord = { timestamp: Date.now(), score: 25 };
    setFlowHistory(prev => [...prev, newRecord]);
  }, [setCompletedCycles, setFlowHistory]);

  const handleAIAdapt = async () => {
    setIsAIAdapting(true);
    try {
      const completedTasks = tasks.filter(t => t.completed).length;
      const suggestion = await getMoodSuggestion(completedTasks, tasks.length, new Date().getHours(), mood);
      
      if (suggestion.theme) {
        setTheme(suggestion.theme);
      }
      
      const suggestedTrack = AMBIENCE_TRACKS.find(track => track.title.toLowerCase().includes(suggestion.music.toLowerCase()));
      if (suggestedTrack) {
        setCurrentTrack(suggestedTrack);
      }

    } catch (error) {
      console.error("AI adaptation failed:", error);
      // Fallback to a default state if AI fails
      setTheme('calm');
      setCurrentTrack(AMBIENCE_TRACKS[0]);
    } finally {
      setIsAIAdapting(false);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'calm');
    root.classList.add(theme);
  }, [theme]);

  const themeConfig = {
    calm: { bg: 'bg-gradient-to-br from-gray-900 via-purple-900/80 to-gray-900', text: 'text-gray-200' },
    light: { bg: 'bg-gradient-to-br from-blue-100 via-pink-100 to-white', text: 'text-gray-800' },
    dark: { bg: 'bg-gradient-to-br from-black via-indigo-900/90 to-black', text: 'text-gray-300' }
  };

  return (
    <div className={`min-h-screen w-full ${themeConfig[theme].bg} ${themeConfig[theme].text} font-sans transition-colors duration-1000 overflow-hidden relative`}>
      <VisualFocusRoom theme={theme} />
      
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <BrainCircuitIcon className="w-8 h-8 text-white/80" />
          <h1 className="text-xl font-bold text-white/90 tracking-wider">VIBESYNC</h1>
        </div>
        <div className="flex items-center gap-3 p-2 bg-black/20 rounded-full backdrop-blur-sm">
          <button onClick={() => setTheme('light')} className={`p-2 rounded-full ${theme === 'light' ? 'bg-white/30' : ''}`}><SunIcon className="w-5 h-5"/></button>
          <button onClick={() => setTheme('dark')} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/30' : ''}`}><MoonIcon className="w-5 h-5"/></button>
          <button onClick={() => setTheme('calm')} className={`p-2 rounded-full ${theme === 'calm' ? 'bg-white/30' : ''}`}><WandSparklesIcon className="w-5 h-5"/></button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-8 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
          
          <div className="lg:col-span-2 space-y-6 xl:space-y-8">
            <PomodoroTimer onCycleComplete={handleCycleComplete} />
            <TaskManager tasks={tasks} setTasks={setTasks} />
          </div>

          <div className="space-y-6 xl:space-y-8">
            <AmbiencePlayer tracks={AMBIENCE_TRACKS} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} />
            <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10">
              <h2 className="text-lg font-semibold mb-4 text-white/90">Dashboard</h2>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white/70 mb-2">How are you feeling?</h3>
                <div className="flex justify-around p-1 bg-white/10 rounded-full">
                    <button onClick={() => setMood('happy')} className={`p-2 rounded-full w-1/3 transition-colors ${mood === 'happy' ? 'bg-white/20' : ''}`} aria-label="Happy"><SmileIcon className="w-5 h-5 mx-auto text-green-300"/></button>
                    <button onClick={() => setMood('neutral')} className={`p-2 rounded-full w-1/3 transition-colors ${mood === 'neutral' ? 'bg-white/20' : ''}`} aria-label="Neutral"><MehIcon className="w-5 h-5 mx-auto text-yellow-300"/></button>
                    <button onClick={() => setMood('tired')} className={`p-2 rounded-full w-1/3 transition-colors ${mood === 'tired' ? 'bg-white/20' : ''}`} aria-label="Tired"><FrownIcon className="w-5 h-5 mx-auto text-red-400"/></button>
                </div>
              </div>
              <FlowScore history={flowHistory} completedCycles={completedCycles}/>
              <button 
                onClick={handleAIAdapt}
                disabled={isAIAdapting}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/50 hover:bg-purple-600/80 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAIAdapting ? 'Adapting...' : 'AI Adaptive Mood'}
                <WandSparklesIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setReflectionModalOpen(true)}
                className="w-full mt-2 px-4 py-3 bg-gray-500/30 hover:bg-gray-500/50 rounded-lg text-white font-semibold transition-all duration-300"
              >
                End-of-Day Reflection
              </button>
            </div>
          </div>
        </div>
      </main>

      <ReflectionModal 
        isOpen={isReflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
        flowScore={totalFlowScore}
        tasksCompleted={tasks.filter(t => t.completed).length}
      />
    </div>
  );
}