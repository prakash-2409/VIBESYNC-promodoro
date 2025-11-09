export interface Task {
  id: string;
  text: string;
  completed: boolean;
  tag: TaskTag;
}

export type TaskTag = 'Study' | 'Work' | 'Gym' | 'Deep Work' | 'Personal';

export interface AmbienceTrack {
  id: number;
  title: string;
  artist: string;
  src: string;
}

export type Theme = 'light' | 'dark' | 'calm';

export type Mood = 'happy' | 'neutral' | 'tired';

export interface FlowRecord {
    timestamp: number;
    score: number;
}
