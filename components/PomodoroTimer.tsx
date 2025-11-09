
import React, { useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { PlayIcon, PauseIcon, RotateCwIcon, SettingsIcon } from './Icons';

interface PomodoroTimerProps {
  onCycleComplete: () => void;
}

const Ring = ({ progress }: { progress: number }) => {
  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="-rotate-90">
      <circle
        stroke="currentColor"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="text-white/20 transition-all duration-300"
      />
      <circle
        stroke="currentColor"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)] transition-all duration-1000"
      />
    </svg>
  );
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onCycleComplete }) => {
  const [settings, setSettings] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    timeLeft,
    isActive,
    mode,
    cycles,
    startTimer,
    pauseTimer,
    resetTimer,
    progress,
  } = useTimer({
    focusDuration: settings.focus * 60,
    shortBreakDuration: settings.shortBreak * 60,
    longBreakDuration: settings.longBreak * 60,
    onCycleComplete,
  });

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSettingsSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSettingsOpen(false);
    resetTimer(); // Reset timer with new settings
  };

  return (
    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center text-center relative">
      <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white/90 transition-colors">
          <SettingsIcon className="w-6 h-6"/>
      </button>

      {isSettingsOpen ? (
        <form onSubmit={handleSettingsSave} className="w-full flex flex-col items-center gap-4 animate-fade-in">
            <h3 className="text-xl font-bold text-white/90 mb-2">Timer Settings</h3>
            <div className="flex gap-4">
                <div>
                    <label className="block text-sm text-white/70">Focus (min)</label>
                    <input type="number" value={settings.focus} onChange={(e) => setSettings(s => ({...s, focus: parseInt(e.target.value)}))} className="w-20 bg-white/10 rounded-md p-2 text-center"/>
                </div>
                <div>
                    <label className="block text-sm text-white/70">Short Break</label>
                    <input type="number" value={settings.shortBreak} onChange={(e) => setSettings(s => ({...s, shortBreak: parseInt(e.target.value)}))} className="w-20 bg-white/10 rounded-md p-2 text-center"/>
                </div>
                 <div>
                    <label className="block text-sm text-white/70">Long Break</label>
                    <input type="number" value={settings.longBreak} onChange={(e) => setSettings(s => ({...s, longBreak: parseInt(e.target.value)}))} className="w-20 bg-white/10 rounded-md p-2 text-center"/>
                </div>
            </div>
            <button type="submit" className="px-6 py-2 bg-purple-600/50 hover:bg-purple-600/80 rounded-lg text-white font-semibold transition-all duration-300">Save</button>
        </form>
      ) : (
        <>
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <Ring progress={progress} />
                <div className="absolute flex flex-col">
                <span className="text-5xl font-bold tracking-tighter text-white/90">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                </div>
            </div>
            
            <p className="mb-1 text-lg font-semibold text-purple-300 capitalize">{mode === 'focus' ? 'Focus' : 'Break'}</p>
            <p className="text-sm text-white/60 mb-6">{mode === 'focus' ? "Let's return to your focus gently." : "Time to breathe and relax."}</p>

            <div className="flex items-center gap-4">
                <button onClick={resetTimer} className="p-3 bg-white/10 rounded-full text-white/70 hover:text-white/90 hover:bg-white/20 transition-all">
                <RotateCwIcon className="w-6 h-6" />
                </button>
                <button onClick={isActive ? pauseTimer : startTimer} className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/30">
                {isActive ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                </button>
                <div className="w-9 h-9 text-lg font-bold text-white/70">#{cycles}</div>
            </div>
        </>
      )}
    </div>
  );
};
