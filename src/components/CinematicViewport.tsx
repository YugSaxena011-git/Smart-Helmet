import React, { useMemo } from 'react';
import { SCENES } from '../data/showcaseData';
import { VisorHudOverlay } from './VisorHudOverlay';
import { TechnicalCalloutsOverlay } from './TechnicalCalloutsOverlay';
import { SubsystemSpec } from '../types';
import { Camera, Film, Layers } from 'lucide-react';

interface CinematicViewportProps {
  currentSecond: number;
  onSelectSubsystem?: (subsystem: SubsystemSpec) => void;
  selectedSubsystemId?: string | null;
}

export const CinematicViewport: React.FC<CinematicViewportProps> = ({
  currentSecond,
  onSelectSubsystem,
  selectedSubsystemId,
}) => {
  // Find the active scene
  const activeScene = useMemo(() => {
    return (
      SCENES.find(
        (scene) => currentSecond >= scene.startSec && currentSecond < scene.endSec
      ) || SCENES[SCENES.length - 1]
    );
  }, [currentSecond]);

  // Compute normalized progress (0 to 1) within the current scene
  const sceneProgress = useMemo(() => {
    const duration = activeScene.endSec - activeScene.startSec;
    return Math.min(1, Math.max(0, (currentSecond - activeScene.startSec) / duration));
  }, [currentSecond, activeScene]);

  // Dynamic Camera motion styles per scene (Ken Burns / dolly / slider / rack focus)
  const cameraTransform = useMemo(() => {
    switch (activeScene.id) {
      case 1:
        // Scene 1 (0-7s): Slow macro dolly in + rack focus (starts slightly soft, snaps tack sharp)
        return {
          transform: `scale(${1.0 + sceneProgress * 0.12}) translate(${-sceneProgress * 15}px, ${sceneProgress * 8}px)`,
          filter: sceneProgress < 0.2 ? `blur(${(0.2 - sceneProgress) * 12}px)` : 'blur(0px)',
          transition: 'transform 0.1s linear, filter 0.2s ease-out',
        };
      case 2:
        // Scene 2 (7-13s): Macro slider movement across circuit board
        return {
          transform: `scale(${1.08 - sceneProgress * 0.04}) translate(${sceneProgress * 25}px, ${-sceneProgress * 10}px)`,
          filter: 'blur(0px)',
          transition: 'transform 0.1s linear',
        };
      case 3:
        // Scene 3 (13-19s): Subtle pedestal lift with depth isolation
        return {
          transform: `scale(${1.02 + sceneProgress * 0.05}) translateY(${-sceneProgress * 12}px)`,
          filter: 'blur(0px)',
          transition: 'transform 0.1s linear',
        };
      case 4:
        // Scene 4 (19-26s): Operator visor perspective with natural subtle sway
        return {
          transform: `scale(1.03) translate(${Math.sin(sceneProgress * Math.PI * 2) * 4}px, ${Math.cos(sceneProgress * Math.PI * 2) * 3}px)`,
          filter: 'blur(0px)',
          transition: 'transform 0.1s ease-out',
        };
      case 5:
        // Scene 5 (26-32s): Emergency state - subtle vibration / focus re-lock
        return {
          transform: `scale(${1.04 + (Math.sin(currentSecond * 15) * 0.005)}) translate(${Math.sin(currentSecond * 20) * 2}px, 0px)`,
          filter: 'blur(0px)',
          transition: 'transform 0.05s ease-in-out',
        };
      case 6:
        // Scene 6 (32-40s): Smooth wide camera pull-back from worker and visor into expansive automated factory
        return {
          transform: `scale(${1.2 - sceneProgress * 0.18}) translateY(${sceneProgress * 10}px)`,
          filter: 'blur(0px)',
          transition: 'transform 0.1s linear',
        };
      case 7:
        // Scene 7 (40-45s): Stabilized hero shot with subtle 3D parallax micro-drift
        return {
          transform: `scale(${1.0 + sceneProgress * 0.04}) translate(${-sceneProgress * 8}px, ${-sceneProgress * 4}px)`,
          filter: 'blur(0px)',
          transition: 'transform 0.1s linear',
        };
      default:
        return { transform: 'scale(1)', filter: 'none' };
    }
  }, [activeScene.id, sceneProgress, currentSecond]);

  return (
    <div className="relative w-full aspect-[16/9] max-h-[72vh] bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none group">
      {/* 1. Underlying Cinematic Photographic Canvas Plate */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={activeScene.image}
          alt={activeScene.title}
          style={cameraTransform}
          className="w-full h-full object-cover object-center origin-center will-change-transform"
        />

        {/* Subtle cinematic vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />

        {/* Subtle film grain & atmospheric tone */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay hud-scanline" />
      </div>

      {/* 2. SCENE-SPECIFIC TECHNICAL OVERLAYS */}

      {/* SCENE 1: Precision Assembly Macro Callouts */}
      {activeScene.id === 1 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Target Reticle on Bosch Sensor Module */}
          <div className="absolute top-[38%] right-[32%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 border border-cyan-400/50 rounded-lg flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            </div>
            <div className="absolute left-20 top-2 bg-slate-950/80 px-2.5 py-1 rounded border border-cyan-500/40 text-[10px] font-mono text-cyan-300 backdrop-blur-sm whitespace-nowrap">
              <span className="text-white font-semibold">BOSCH BMA150 SENSOR</span>
              <span className="text-slate-400 block text-[9px]">SURFACE-MOUNT CALIBRATED</span>
            </div>
          </div>

          {/* Microcontroller solder pinout callout */}
          <div className="absolute top-[48%] left-[34%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 border border-slate-400/40 rounded-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </div>
            <div className="absolute right-14 top-1 bg-slate-950/80 px-2 py-1 rounded border border-slate-700 text-[10px] font-mono text-slate-300 backdrop-blur-sm whitespace-nowrap">
              <span className="text-amber-400 font-semibold">ST-ARM CORTEX MCU</span>
              <span className="text-slate-400 block text-[9px]">ESD GROUNDED 100%</span>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 2: Animated Circuit Data Pulses & Diagnostic Schematics */}
      {activeScene.id === 2 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* SVG Data pulse circuit lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Connecting bus traces */}
            <path
              d="M 280 420 L 420 380 L 520 280 L 680 240"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2"
              strokeDasharray="6,4"
              strokeOpacity="0.6"
            />
            <circle cx="520" cy="280" r="5" fill="#00E5FF" className="animate-ping" />

            <path
              d="M 520 280 L 720 360 L 780 320"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              strokeOpacity="0.5"
            />
          </svg>

          {/* Diagnostic status telemetry overlay */}
          <div className="absolute top-8 right-8 bg-slate-950/85 p-3 rounded-lg border border-cyan-500/40 font-mono text-[11px] text-cyan-300 backdrop-blur-md space-y-1 shadow-xl">
            <div className="flex items-center justify-between gap-4 border-b border-cyan-500/20 pb-1">
              <span className="text-[10px] text-slate-400">BUS ARCHITECTURE</span>
              <span className="text-emerald-400 font-bold">INITIALIZED</span>
            </div>
            <div className="flex justify-between gap-6 text-[10px]">
              <span className="text-slate-400">THERMAL I2C:</span>
              <span className="text-slate-100">400 kHz SYNC</span>
            </div>
            <div className="flex justify-between gap-6 text-[10px]">
              <span className="text-slate-400">ACCEL SPI:</span>
              <span className="text-slate-100">10 MHz LOCKED</span>
            </div>
            <div className="flex justify-between gap-6 text-[10px]">
              <span className="text-slate-400">STATUS LEDS:</span>
              <span className="text-cyan-300">ACTIVE (4/4)</span>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 3: Faceless Worker Factory HUD Overlay */}
      {activeScene.id === 3 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Target Box on Helmet */}
          <div className="absolute top-[18%] left-[48%] -translate-x-1/2 w-28 h-32 border border-cyan-400/50 rounded-lg flex flex-col justify-between p-1.5">
            <div className="flex justify-between text-[9px] font-mono text-cyan-300">
              <span>HELMET #01</span>
              <span className="text-emerald-400">DEPLOYED</span>
            </div>
            <div className="text-[9px] font-mono text-slate-300 bg-slate-950/80 px-1 py-0.5 rounded text-center">
              FACIAL: ANONYMOUS
            </div>
          </div>

          <div className="absolute bottom-16 left-8 bg-slate-950/80 px-4 py-2.5 rounded-lg border border-slate-700/80 font-mono text-xs backdrop-blur-md">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">
              DEPLOYMENT ENVIRONMENT
            </div>
            <div className="font-semibold text-slate-100 text-sm">
              Automated Advanced Manufacturing Cell
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              Worker Status: Integrated · PPE Certified
            </div>
          </div>
        </div>
      )}

      {/* SCENES 4 & 5: Complete Visor HUD Projection (Normal & Critical Alert) */}
      {(activeScene.id === 4 || activeScene.id === 5) && (
        <VisorHudOverlay currentSecond={currentSecond} />
      )}

      {/* SCENE 6: Wide Automated Factory Tracking Nodes */}
      {activeScene.id === 6 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Robotic Arm Marker 1 */}
          <div className="absolute top-[48%] left-[28%] bg-slate-950/80 border border-cyan-500/40 px-2 py-1 rounded text-[10px] font-mono text-cyan-300 backdrop-blur-sm">
            <div className="font-bold text-slate-100">ROBOTIC CELL 01</div>
            <div className="text-slate-400 text-[9px]">CYCLE: 14.8s · ACTIVE</div>
          </div>

          {/* Autonomous Conveyor Line Marker */}
          <div className="absolute bottom-[22%] left-[45%] bg-slate-950/80 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono text-slate-200 backdrop-blur-sm">
            <span className="text-amber-400 font-semibold">CONVEYOR LINE-B</span>
            <span className="text-slate-400 text-[9px] block">THROUGHPUT: 100% NOMINAL</span>
          </div>

          {/* Live Factory Telemetry Corner Widget */}
          <div className="absolute top-6 left-6 bg-slate-950/90 border border-slate-800 p-3 rounded-lg font-mono text-[11px] backdrop-blur-md space-y-1">
            <div className="text-[9px] text-cyan-400 tracking-wider uppercase font-bold">
              FACILITY SENSOR GRID
            </div>
            <div className="text-slate-200">ACTIVE WORKERS: 18 CONNECTED</div>
            <div className="text-slate-400 text-[10px]">MESH LATENCY: 0.8ms · STABLE</div>
          </div>
        </div>
      )}

      {/* SCENE 7: Hero Shot with 6 Interactive Technical Callouts */}
      {activeScene.id === 7 && (
        <TechnicalCalloutsOverlay
          onSelectSubsystem={onSelectSubsystem}
          selectedSubsystemId={selectedSubsystemId}
        />
      )}

      {/* 3. CINEMATIC OVERLAY METADATA (Director Timecode & Scene Name Header) */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        {/* Left: Scene Number & Natural Editorial Title */}
        <div className="bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
          <Film className="w-3.5 h-3.5 text-cyan-400" />
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-cyan-400 font-bold">0{activeScene.id}</span>
            <span className="text-slate-500">·</span>
            <span className="font-medium text-slate-100">{activeScene.title}</span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">{activeScene.subtitle}</span>
          </div>
        </div>

        {/* Right: Camera Movement Description */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-300">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate max-w-xs">{activeScene.cameraMovement}</span>
        </div>
      </div>

      {/* 4. Bottom Left Director Focus Marker */}
      <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 pointer-events-none bg-slate-950/70 px-3 py-1.5 rounded-md border border-slate-800/60 backdrop-blur-sm text-[10px] font-mono text-slate-400 z-20">
        <Layers className="w-3 h-3 text-cyan-400" />
        <span>FOCUS: {activeScene.focusTarget}</span>
      </div>
    </div>
  );
};
