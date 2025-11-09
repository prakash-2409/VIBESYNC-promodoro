
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  onCycleComplete: () => void;
}

export const useTimer = ({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  onCycleComplete,
}: UseTimerProps) => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(focusDuration);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(1);
  const [progress, setProgress] = useState(100);

  const intervalRef = useRef<number | null>(null);

  const switchMode = useCallback(() => {
    if (mode === 'focus') {
      onCycleComplete();
      if (cycles % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(longBreakDuration);
      } else {
        setMode('shortBreak');
        setTimeLeft(shortBreakDuration);
      }
    } else {
      setMode('focus');
      setTimeLeft(focusDuration);
      // FIX: The comparison `mode !== 'focus'` was redundant inside this else-block, causing a type error.
      // The logic is to increment cycles after a break, which is correct.
      setCycles(prev => prev + 1);
    }
    setIsActive(false);
  }, [mode, cycles, onCycleComplete, focusDuration, shortBreakDuration, longBreakDuration]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            const endSound = document.getElementById('end-sound') as HTMLAudioElement;
            if (endSound) endSound.play();
            switchMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, switchMode]);

  useEffect(() => {
    const totalDuration =
      mode === 'focus'
        ? focusDuration
        : mode === 'shortBreak'
        ? shortBreakDuration
        : longBreakDuration;
    setProgress((timeLeft / totalDuration) * 100);
  }, [timeLeft, mode, focusDuration, shortBreakDuration, longBreakDuration]);

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMode('focus');
    setTimeLeft(focusDuration);
    setCycles(1);
  }, [focusDuration]);
  
  // Reset timer if durations change
  useEffect(() => {
    resetTimer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusDuration, shortBreakDuration, longBreakDuration]);


  return { timeLeft, isActive, mode, cycles, progress, startTimer, pauseTimer, resetTimer };
};
