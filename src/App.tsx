import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { CinematicViewport } from './components/CinematicViewport';
import { TimelineController } from './components/TimelineController';
import { SubsystemInspector } from './components/SubsystemInspector';
import { VisorSimulator } from './components/VisorSimulator';
import { SceneGuideModal } from './components/SceneGuideModal';
import { soundEngine } from './audio/soundEngine';
import { SubsystemSpec } from './types';
import { SCENES } from './data/showcaseData';
import {
  Film,
  Cpu,
  Eye,
  Sliders,
  Sparkles,
  ShieldCheck,
  Radio,
  Clock,
  Layers,
} from 'lucide-react';

export default function App() {
  // Navigation View: 'showcase' | 'inspector' | 'sandbox'
  const [activeView, setActiveView] = useState<'showcase' | 'inspector' | 'sandbox'>('showcase');

  // Timeline playback state
  const [currentSecond, setCurrentSecond] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  const DURATION = 45.0; // 45-second cinematic showcase

  // Master Clock Animation Loop
  const tick = useCallback(() => {
    const now = performance.now();
    const deltaMs = now - lastTimeRef.current;
    lastTimeRef.current = now;

    if (isPlaying) {
      setCurrentSecond((prev) => {
        const nextTime = prev + (deltaMs / 1000) * playbackRate;
        if (nextTime >= DURATION) {
          // Finished 45s run, loop or hold at hero shot
          soundEngine.updateSceneAudio(DURATION, false);
          return 0; // Loop seamlessly back to assembly
        }
        soundEngine.updateSceneAudio(nextTime, true);
        return nextTime;
      });
    }

    animationFrameRef.current = requestAnimationFrame(tick);
  }, [isPlaying, playbackRate]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tick]);

  // Audio initialization on first user interaction
  const handleTogglePlay = () => {
    soundEngine.init();
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    soundEngine.init();
    soundEngine.playPrecisionClick();
    setCurrentSecond(0);
    setIsPlaying(true);
  };

  const handleSeek = (time: number) => {
    soundEngine.init();
    const clamped = Math.max(0, Math.min(DURATION, time));
    setCurrentSecond(clamped);
    soundEngine.updateSceneAudio(clamped, isPlaying);
  };

  const handleToggleMute = () => {
    soundEngine.init();
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleChangeVolume = (vol: number) => {
    soundEngine.init();
    soundEngine.setVolume(vol);
    setVolume(vol);
    if (isMuted && vol > 0) {
      soundEngine.toggleMute();
      setIsMuted(false);
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSelectSubsystemFromCallout = (subsystem: SubsystemSpec) => {
    setSelectedSubsystemId(subsystem.id);
  };

  // Determine active scene
  const activeScene = SCENES.find(
    (scene) => currentSecond >= scene.startSec && currentSecond < scene.endSec
  ) || SCENES[SCENES.length - 1];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* 1. Header with strict Top Bar Contract (§2) */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        currentSecond={currentSecond}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs for View Modes */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg text-xs font-mono">
            <button
              onClick={() => setActiveView('showcase')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
                activeView === 'showcase'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic 45s Showcase</span>
            </button>

            <button
              onClick={() => setActiveView('inspector')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
                activeView === 'inspector'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Subsystems & Specs</span>
            </button>

            <button
              onClick={() => setActiveView('sandbox')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
                activeView === 'sandbox'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visor HUD Sandbox</span>
            </button>
          </div>

          {/* Quick Scene Guide & Storyboard Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors border border-slate-800"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scene Storyboard (7 Scenes)</span>
          </button>
        </div>

        {/* VIEW 1: CINEMATIC SHOWCASE MODE */}
        {activeView === 'showcase' && (
          <div className="space-y-4">
            {/* The 16:9 Cinema Viewport */}
            <CinematicViewport
              currentSecond={currentSecond}
              onSelectSubsystem={handleSelectSubsystemFromCallout}
              selectedSubsystemId={selectedSubsystemId}
            />

            {/* Master Scrubbing & Transport Controller */}
            <TimelineController
              currentSecond={currentSecond}
              duration={DURATION}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onSeek={handleSeek}
              onReset={handleReset}
              playbackRate={playbackRate}
              onSetPlaybackRate={setPlaybackRate}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              volume={volume}
              onChangeVolume={handleChangeVolume}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
            />

            {/* Curated Editorial Context Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>SCENE SYNOPSIS</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Scene 0{activeScene.id}: {activeScene.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeScene.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>DIRECTOR CAMERA LOG</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  <span className="text-slate-500 block text-[10px]">MOTION PROFILE:</span>
                  {activeScene.cameraMovement}
                </div>
                <div className="text-xs text-slate-300 font-mono pt-1">
                  <span className="text-slate-500 block text-[10px]">FOCAL TARGET:</span>
                  {activeScene.focusTarget}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>SYNTHESIZED AUDIO CUES</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
                  {activeScene.audioCues.map((cue, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      <span>{cue}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  Generated dynamically via Web Audio API. Zero external audio lag.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SUBSYSTEM ARCHITECTURE INSPECTOR */}
        {activeView === 'inspector' && (
          <SubsystemInspector initialSubsystemId={selectedSubsystemId} />
        )}

        {/* VIEW 3: VISOR HUD FLIGHT SIMULATOR */}
        {activeView === 'sandbox' && <VisorSimulator />}
      </main>

      {/* 3. Footer adhering strictly to Anti-Slop Guidelines (§1.B) */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">AegisCore Technologies</span>
            <span aria-hidden="true">·</span>
            <span>Industrial Smart Safety Helmet Platform</span>
            <span aria-hidden="true">·</span>
            <span>ANSI Z89.1 / EN 397 Certified</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Production Storyboard
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveView('inspector')}
              className="hover:text-slate-300 transition-colors"
            >
              Hardware Specifications
            </button>
            <span aria-hidden="true">·</span>
            <span>45s Master Reel</span>
          </div>
        </div>
      </footer>

      {/* Scene Guide / Storyboard Modal */}
      <SceneGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectScene={(seconds) => {
          handleSeek(seconds);
          setActiveView('showcase');
        }}
      />
    </div>
  );
}
