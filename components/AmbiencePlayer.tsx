
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AmbienceTrack } from '../types';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, Volume2Icon, VolumeXIcon } from './Icons';

interface AmbiencePlayerProps {
  tracks: AmbienceTrack[];
  currentTrack: AmbienceTrack;
  setCurrentTrack: (track: AmbienceTrack) => void;
}

export const AmbiencePlayer: React.FC<AmbiencePlayerProps> = ({ tracks, currentTrack, setCurrentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const findCurrentTrackIndex = useCallback(() => {
      return tracks.findIndex(track => track.id === currentTrack.id);
  }, [tracks, currentTrack]);

  const playNext = useCallback(() => {
    const currentIndex = findCurrentTrackIndex();
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  }, [findCurrentTrackIndex, tracks, setCurrentTrack]);

  const playPrev = () => {
    const currentIndex = findCurrentTrackIndex();
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
  };
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleEnded = () => playNext();
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
        audio.src = currentTrack.src;
        audio.play().catch(e => console.error("Audio play failed:", e));
    }

    return () => {
        audio.removeEventListener('ended', handleEnded);
    }
  }, [currentTrack, isPlaying, playNext]);


  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };
  

  return (
    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10">
      <h2 className="text-lg font-semibold mb-4 text-white/90">Ambience</h2>
      <div className="text-center mb-4">
        <p className="text-xl font-bold text-white/95">{currentTrack.title}</p>
        <p className="text-sm text-white/60">{currentTrack.artist}</p>
      </div>
      
      <div className="flex justify-center items-center gap-6 mb-4">
        <button onClick={playPrev} className="text-white/70 hover:text-white transition-colors"><SkipBackIcon className="w-6 h-6"/></button>
        <button onClick={togglePlayPause} className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/30">
          {isPlaying ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7" />}
        </button>
        <button onClick={playNext} className="text-white/70 hover:text-white transition-colors"><SkipForwardIcon className="w-6 h-6"/></button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setIsMuted(!isMuted)}>
          {isMuted || volume === 0 ? <VolumeXIcon className="w-5 h-5 text-white/70"/> : <Volume2Icon className="w-5 h-5 text-white/70"/>}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={e => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
          }}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-400"
        />
      </div>
      <audio ref={audioRef} src={currentTrack.src} />
    </div>
  );
};
