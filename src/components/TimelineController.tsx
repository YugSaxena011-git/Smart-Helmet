import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  FastForward,
} from 'lucide-react';
import { SCENES } from '../data/showcaseData';
import { soundEngine } from '../audio/soundEngine';

interface TimelineControllerProps {
  currentSecond: number;
  duration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onReset: () => void;
  playbackRate: number;
  onSetPlaybackRate: (rate: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentSecond,
  duration,
  isPlaying,
  onTogglePlay,
  onSeek,
  onReset,
  playbackRate,
  onSetPlaybackRate,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  // Format seconds to MM:SS.SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(2, '0')}`;
  };

  // Handle clicking or dragging on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    setHoverTime(ratio * duration);
  };

  // Audio waveform / visualizer rendering
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = soundEngine.getAnalyser();
    const dataArray = new Uint8Array(32);

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyser && !isMuted && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Draw baseline
        for (let i = 0; i < 32; i++) {
          dataArray[i] = 4;
        }
      }

      const barWidth = canvas.width / 32;
      for (let i = 0; i < 32; i++) {
        const barHeight = Math.max(2, (dataArray[i] / 255) * canvas.height);
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        ctx.fillStyle = currentSecond >= 26 && currentSecond < 32 
          ? 'rgba(239, 68, 68, 0.75)' 
          : 'rgba(6, 182, 212, 0.75)';
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isMuted, currentSecond]);

  const progressPercent = Math.min(100, Math.max(0, (currentSecond / duration) * 100));

  return (
    <div className="bg-slate-950/95 border-t border-slate-800 p-4 select-none">
      {/* 1. Master Scrubber Bar with Scene Tick Markers */}
      <div className="relative mb-3">
        {/* Hover Time Tooltip */}
        {hoverTime !== null && (
          <div
            className="absolute -top-7 -translate-x-1/2 bg-slate-900 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 px-1.5 py-0.5 rounded shadow pointer-events-none z-30"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverTime(null)}
          className="relative h-2.5 w-full bg-slate-900 rounded-full cursor-pointer overflow-hidden border border-slate-800"
        >
          {/* Filled Progress */}
          <div
            className={`h-full transition-all duration-75 ${
              currentSecond >= 26 && currentSecond < 32
                ? 'bg-gradient-to-r from-red-600 to-amber-500'
                : 'bg-gradient-to-r from-cyan-500 to-cyan-300'
            }`}
            style={{ width: `${progressPercent}%` }}
          />

          {/* Scene Boundaries Markers */}
          {SCENES.map((scene) => (
            <div
              key={scene.id}
              className="absolute top-0 bottom-0 w-[1px] bg-slate-700/80 pointer-events-none"
              style={{ left: `${(scene.startSec / duration) * 100}%` }}
              title={scene.title}
            />
          ))}
        </div>
      </div>

      {/* 2. Scene Quick Selector Tabs */}
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {SCENES.map((scene) => {
          const isActive = currentSecond >= scene.startSec && currentSecond < scene.endSec;
          const isAlert = scene.id === 5;

          return (
            <button
              key={scene.id}
              onClick={() => onSeek(scene.startSec)}
              className={`p-1.5 rounded text-left transition-all border ${
                isActive
                  ? isAlert
                    ? 'bg-red-950/80 border-red-500 text-white shadow-sm shadow-red-500/20'
                    : 'bg-slate-900 border-cyan-400 text-white shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono leading-none mb-1">
                <span className={isActive ? (isAlert ? 'text-red-400 font-bold' : 'text-cyan-400 font-bold') : 'text-slate-500'}>
                  S0{scene.id}
                </span>
                <span className="tabular-nums text-slate-400 text-[9px]">
                  {scene.startSec}s-{scene.endSec}s
                </span>
              </div>
              <div className="text-[11px] font-semibold truncate leading-tight">
                {scene.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Controls & Master Metronome Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-slate-900">
        {/* Left: Playback controls & Timecode */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
              isPlaying
                ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                : 'bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-700'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Master Timecode readout */}
          <div className="font-mono text-xs tabular-nums text-slate-300 ml-1">
            <span className="text-cyan-400 font-semibold">{formatTime(currentSecond)}</span>
            <span className="text-slate-600 mx-1.5">/</span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Center: Realtime Audio Waveform Equalizer */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            SYNTH AUDIO
          </span>
          <canvas
            ref={canvasRef}
            width={120}
            height={20}
            className="rounded bg-slate-900/80 border border-slate-800/80"
          />
        </div>

        {/* Right: Speed, Volume, Fullscreen */}
        <div className="flex items-center gap-4 text-xs font-mono">
          {/* Playback speed selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-md border border-slate-800 text-[11px]">
            <FastForward className="w-3 h-3 text-slate-500 ml-1 mr-0.5" />
            {[0.5, 1.0, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => onSetPlaybackRate(rate)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  playbackRate === rate
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-16 h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              title="Volume"
            />
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
