'use client';

import { AlertCircle, Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { musicMoods } from '@/lib/music/catalog';
import { useMusic } from './music-provider';

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
}

export function MusicPlayerShell() {
  const pathname = usePathname();
  const music = useMusic();
  const { expanded, setExpanded } = music;
  const shellRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!expanded) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (shellRef.current && !shellRef.current.contains(event.target as Node)) setExpanded(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [expanded, setExpanded]);

  if (pathname.startsWith('/offering/') || pathname.startsWith('/inbox/')) return null;

  return (
    <aside ref={shellRef} className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 sm:bottom-6 sm:right-6" aria-label="Music player">
      {music.expanded && <section id="garawa-music-panel" role="dialog" aria-label="Music player and library" className="absolute bottom-[4.25rem] right-0 max-h-[min(70vh,590px)] w-[min(370px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-[var(--line)] bg-[var(--paper)]/98 shadow-[var(--shadow)] backdrop-blur sm:bottom-[4.5rem]">
        <div className="flex items-center gap-3 border-b border-[var(--line)] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--red)]"><Music2 size={20} /></div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[var(--ink)]">{music.currentTrack?.title ?? 'Garawa Music'}</p><p className="truncate text-xs text-[var(--muted)]">{music.currentTrack?.artist ?? (music.hasTracks ? 'တေးသွားရွေးချယ်ပါ' : 'Music library is not available yet')}</p></div>
          <button ref={closeRef} type="button" onClick={() => { music.setExpanded(false); triggerRef.current?.focus(); }} className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--cream)]" aria-label="Close music player"><X size={18} /></button>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <button type="button" disabled={!music.hasTracks} onClick={music.previous} className="rounded-full p-2 text-[var(--ink)] hover:bg-[var(--cream)] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Previous track"><SkipBack size={17} /></button>
            <button type="button" disabled={!music.hasTracks || music.loading} onClick={() => void music.togglePlay()} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--red)] text-white hover:bg-[var(--red-dark)] disabled:cursor-not-allowed disabled:opacity-40" aria-label={music.isPlaying ? 'Pause music' : 'Play music'}>{music.isPlaying ? <Pause size={17} /> : <Play size={17} />}</button>
            <button type="button" disabled={!music.hasTracks} onClick={music.next} className="rounded-full p-2 text-[var(--ink)] hover:bg-[var(--cream)] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Next track"><SkipForward size={17} /></button>
            <input aria-label="Music progress" type="range" min="0" max={music.duration || 0} step="0.1" value={Math.min(music.currentTime, music.duration || 0)} disabled={!music.currentTrack || !music.duration} onChange={(event) => music.seek(Number(event.target.value))} className="min-w-0 flex-1 accent-[var(--red)] disabled:opacity-35" />
            <button type="button" disabled={!music.hasTracks} onClick={music.toggleMute} className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--cream)] disabled:cursor-not-allowed disabled:opacity-35" aria-label={music.muted ? 'Unmute music' : 'Mute music'}>{music.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[var(--muted)]"><span>{formatTime(music.currentTime)}</span><span>{formatTime(music.duration)}</span></div>
          {music.hasTracks && <label className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]"><Volume2 size={14} /><span className="sr-only">Music volume</span><input aria-label="Music volume" type="range" min="0" max="1" step="0.01" value={music.volume} onChange={(event) => music.setVolume(Number(event.target.value))} className="flex-1 accent-[var(--red)]" /></label>}
          {!music.hasTracks && <div className="mt-3 flex items-start gap-2 rounded-xl bg-[var(--cream)] p-3 text-xs leading-5 text-[var(--muted)]"><AlertCircle size={15} className="mt-0.5 shrink-0 text-[var(--gold)]" />Licensed music will appear here when it is added.</div>}
          {music.error && <p role="alert" className="mt-2 text-xs text-[var(--red)]">{music.error}</p>}
        </div>

        <div className="border-t border-[var(--line)] p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-[var(--ink)]">Music library</h2><span className="text-xs text-[var(--muted)]">{music.tracks.length} tracks</span></div>
          <div className="mb-3 flex gap-1 overflow-x-auto pb-1">{([{ id: 'all', label: 'All' }, ...musicMoods] as const).map((mood) => <button key={mood.id} type="button" onClick={() => music.setSelectedMood(mood.id)} className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${music.selectedMood === mood.id ? 'bg-[var(--red)] text-white' : 'bg-[var(--cream)] text-[var(--muted)]'}`}>{mood.label}</button>)}</div>
          {music.filteredTracks.length === 0 ? <p className="rounded-xl bg-[var(--cream)] p-3 text-sm leading-6 text-[var(--muted)]">Your music library is ready for original or properly licensed tracks.</p> : <div className="space-y-2">{music.filteredTracks.map((track) => <button key={track.id} type="button" onClick={() => music.setTrack(track.id)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[var(--cream)]"><Music2 size={16} className="text-[var(--red)]" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{track.title}</span><span className="block truncate text-xs text-[var(--muted)]">{track.artist} · {track.license}</span></span></button>)}</div>}
        </div>
      </section>}

      <button ref={triggerRef} type="button" onClick={() => music.setExpanded(!music.expanded)} className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--red)] text-white shadow-[var(--shadow)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--red-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)] motion-reduce:transition-none motion-reduce:hover:transform-none" aria-label={music.expanded ? 'Close music player' : 'Open music player'} aria-expanded={music.expanded} aria-controls="garawa-music-panel"><Music2 size={22} /></button>
    </aside>
  );
}
