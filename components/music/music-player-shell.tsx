'use client';

import { AlertCircle, ChevronDown, ChevronUp, Library, Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { musicMoods } from '@/lib/music/catalog';
import { useMusic } from './music-provider';

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
}

export function MusicPlayerShell() {
  const pathname = usePathname();
  const music = useMusic();
  if (pathname.startsWith('/offering/') || pathname.startsWith('/inbox/')) return null;

  return (
    <aside className="fixed bottom-3 right-3 z-40 w-[min(370px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)]/95 shadow-[var(--shadow)] backdrop-blur" aria-label="Music player">
      <div className="flex items-center gap-3 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--red)]"><Music2 size={20} /></div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--ink)]">{music.currentTrack?.title ?? 'Garawa Music'}</p>
          <p className="truncate text-xs text-[var(--muted)]">{music.currentTrack?.artist ?? (music.hasTracks ? 'တေးသွားရွေးချယ်ပါ' : 'Music library is not available yet')}</p>
        </div>
        <button type="button" onClick={() => music.setExpanded(!music.expanded)} className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--cream)]" aria-label={music.expanded ? 'Close music library' : 'Open music library'}>
          {music.expanded ? <ChevronDown size={18} /> : <Library size={18} />}
        </button>
      </div>

      <div className="px-3 pb-3">
        <div className="mb-2 flex items-center gap-2">
          <button type="button" disabled={!music.hasTracks} onClick={music.previous} className="rounded-full p-2 text-[var(--ink)] hover:bg-[var(--cream)] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Previous track"><SkipBack size={17} /></button>
          <button type="button" disabled={!music.hasTracks || music.loading} onClick={() => void music.togglePlay()} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--red)] text-white hover:bg-[var(--red-dark)] disabled:cursor-not-allowed disabled:opacity-40" aria-label={music.isPlaying ? 'Pause music' : 'Play music'}>{music.isPlaying ? <Pause size={17} /> : <Play size={17} />}</button>
          <button type="button" disabled={!music.hasTracks} onClick={music.next} className="rounded-full p-2 text-[var(--ink)] hover:bg-[var(--cream)] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Next track"><SkipForward size={17} /></button>
          <input aria-label="Music progress" type="range" min="0" max={music.duration || 0} step="0.1" value={Math.min(music.currentTime, music.duration || 0)} disabled={!music.currentTrack || !music.duration} onChange={(event) => music.seek(Number(event.target.value))} className="min-w-0 flex-1 accent-[var(--red)] disabled:opacity-35" />
          <button type="button" disabled={!music.hasTracks} onClick={music.toggleMute} className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--cream)] disabled:cursor-not-allowed disabled:opacity-35" aria-label={music.muted ? 'Unmute music' : 'Mute music'}>{music.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[var(--muted)]"><span>{formatTime(music.currentTime)}</span><span>{formatTime(music.duration)}</span></div>
        {music.hasTracks && <label className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]"><Volume2 size={14} /><input aria-label="Music volume" type="range" min="0" max="1" step="0.01" value={music.volume} onChange={(event) => music.setVolume(Number(event.target.value))} className="flex-1 accent-[var(--red)]" /></label>}
        {!music.hasTracks && <div className="mt-2 flex items-start gap-2 rounded-xl bg-[var(--cream)] p-2 text-xs leading-5 text-[var(--muted)]"><AlertCircle size={15} className="mt-0.5 shrink-0 text-[var(--gold)]" />Licensed music will appear here when it is added.</div>}
        {music.error && <p role="alert" className="mt-2 text-xs text-[var(--red)]">{music.error}</p>}
      </div>

      {music.expanded && <div className="border-t border-[var(--line)] p-3">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-[var(--ink)]">Music library</h2><span className="text-xs text-[var(--muted)]">{music.tracks.length} tracks</span></div>
        <div className="mb-3 flex gap-1 overflow-x-auto pb-1">{([{ id: 'all', label: 'All' }, ...musicMoods] as const).map((mood) => <button key={mood.id} type="button" onClick={() => music.setSelectedMood(mood.id)} className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${music.selectedMood === mood.id ? 'bg-[var(--red)] text-white' : 'bg-[var(--cream)] text-[var(--muted)]'}`}>{mood.label}</button>)}</div>
        {music.filteredTracks.length === 0 ? <p className="rounded-xl bg-[var(--cream)] p-3 text-sm leading-6 text-[var(--muted)]">Your music library is ready for original or properly licensed tracks.</p> : <div className="space-y-2">{music.filteredTracks.map((track) => <button key={track.id} type="button" onClick={() => { music.setTrack(track.id); void music.play(); }} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[var(--cream)]"><Music2 size={16} className="text-[var(--red)]" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{track.title}</span><span className="block truncate text-xs text-[var(--muted)]">{track.artist} · {track.license}</span></span></button>)}</div>}
      </div>}
    </aside>
  );
}
