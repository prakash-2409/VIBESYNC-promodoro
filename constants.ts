
import type { TaskTag, AmbienceTrack } from './types';

export const TASK_TAGS: TaskTag[] = ['Study', 'Work', 'Gym', 'Deep Work', 'Personal'];

export const AMBIENCE_TRACKS: AmbienceTrack[] = [
  {
    id: 1,
    title: 'Lofi Beats',
    artist: 'Chillhop Music',
    src: 'https://cdn.pixabay.com/audio/2023/11/22/audio_f1c50a1a51.mp3',
  },
  {
    id: 2,
    title: 'Calm River',
    artist: 'Nature Sounds',
    src: 'https://cdn.pixabay.com/audio/2022/10/18/audio_245229c997.mp3',
  },
  {
    id: 3,
    title: 'Rain Room',
    artist: 'Ambient Noise',
    src: 'https://cdn.pixabay.com/audio/2022/08/19/audio_d0a1b6a001.mp3',
  },
  {
    id: 4,
    title: 'Coffee Shop',
    artist: 'City Ambience',
    src: 'https://cdn.pixabay.com/audio/2022/04/18/audio_349069d5ce.mp3',
  },
];
