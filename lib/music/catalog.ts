export type MusicMood = 'peaceful' | 'nostalgic' | 'cheerful';

export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  mood: MusicMood;
  src: string | null;
  artwork?: string;
  duration?: number;
  attribution: string;
  license: string;
};

export const musicMoods: Array<{ id: MusicMood; label: string; labelEn: string }> = [
  { id: 'peaceful', label: 'အေးချမ်း', labelEn: 'Peaceful' },
  { id: 'nostalgic', label: 'လွမ်းဆွတ်', labelEn: 'Nostalgic' },
  { id: 'cheerful', label: 'ရွှင်လန်း', labelEn: 'Cheerful' },
];

// Keep this list empty until the project owner supplies original, public-domain,
// or properly licensed audio and its exact attribution/license details.
export const musicTracks: MusicTrack[] = [];

