import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeView: 'showcase' | 'inspector' | 'sandbox';
  setActiveView: (view: 'showcase' | 'inspector' | 'sandbox') => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentSecond: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  isPlaying,
  onTogglePlay,
  onReset,
  isMuted,
  onToggleMute,
  currentSecond,
}) => {
  const isAlertTime = currentSecond >= 26 && currentSecond < 32;

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('showcase');
          }}
          className="text-base font-bold tracking-wider text-slate-100 uppercase whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors"
        >
          AegisCore
        </a>
        {isAlertTime && (
          <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-400 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>THERMAL ALERT ACTIVE</span>
          </span>
        )}
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveView('showcase')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'showcase' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Cinematic Showcase
        </button>
        <button
          onClick={() => setActiveView('inspector')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'inspector' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Subsystem Architecture
        </button>
        <button
          onClick={() => setActiveView('sandbox')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'sandbox' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Visor HUD Simulator
        </button>
        <a
          href="#specifications"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('inspector');
          }}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
          Technical Specifications
        </a>
        <a
          href="#compliance"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('inspector');
          }}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
          Industrial Compliance
        </a>
      </nav>

      {/* Zone 3: 1 primary action group */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          onClick={onReset}
          title="Restart Showcase to 00:00"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
          aria-label="Restart Showcase"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePlay}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/20"
        >
          <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-current' : ''}`} />
          <span>{isPlaying ? 'Pause' : 'Play Showcase'}</span>
        </button>
      </div>
    </header>
  );
};
