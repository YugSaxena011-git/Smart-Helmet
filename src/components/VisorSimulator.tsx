import React, { useState, useEffect } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { VisorHudOverlay } from './VisorHudOverlay';
import { Flame, ShieldCheck, RotateCcw, AlertOctagon } from 'lucide-react';

export const VisorSimulator: React.FC = () => {
  const [ambientTemp, setAmbientTemp] = useState<number>(24);
  const [helmetTemp, setHelmetTemp] = useState<number>(27);
  const [opticalBrightness, setOpticalBrightness] = useState<number>(100);

  // Critical threshold: >= 50°C triggers the warning
  const isAlert = ambientTemp >= 50;

  useEffect(() => {
    // When alert becomes active, play warning pulse
    if (isAlert) {
      soundEngine.updateSceneAudio(27, true);
    } else {
      soundEngine.updateSceneAudio(20, true);
    }
    return () => {
      soundEngine.stopAll();
    };
  }, [isAlert]);

  const handleTempChange = (val: number) => {
    setAmbientTemp(val);
    // Helmet temp lags slightly behind ambient temp
    const newHelmet = Math.round(24 + (val - 24) * 0.55);
    setHelmetTemp(newHelmet);
  };

  const resetToSafe = () => {
    soundEngine.playCalloutClick();
    setAmbientTemp(24);
    setHelmetTemp(27);
  };

  const triggerCriticalSpike = () => {
    soundEngine.playPrecisionClick();
    setAmbientTemp(86);
    setHelmetTemp(64);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
            Operator Perspective · Waveguide Projection
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Visor HUD Interactive Flight Simulator
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate the first-person augmented reality display. Adjust ambient thermal conditions to witness real-time HUD threshold transitions between nominal safe monitoring and critical emergency evacuation protocols.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToSafe}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (24°C Safe)</span>
          </button>
          <button
            onClick={triggerCriticalSpike}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-xs font-mono font-bold text-white rounded-lg transition-colors shadow-sm shadow-red-500/20"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Simulate Thermal Spike</span>
          </button>
        </div>
      </div>

      {/* Simulator Viewport */}
      <div className="relative w-full aspect-[16/9] max-h-[65vh] bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Background Image: View through visor */}
        <img
          src="/src/assets/images/scene4_visor_hud_view_1793809529242.jpg"
          alt="Visor perspective"
          className="w-full h-full object-cover object-center"
          style={{ opacity: opticalBrightness / 100 }}
        />

        {/* Visor HUD Overlay with dynamic user overrides */}
        <VisorHudOverlay
          currentSecond={isAlert ? 28 : 22}
          overrideTempRise={isAlert}
        />
      </div>

      {/* Simulation Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        {/* Control 1: Ambient Temperature Slider */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Flame className={`w-4 h-4 ${isAlert ? 'text-red-500' : 'text-cyan-400'}`} />
              <span>AMBIENT TEMPERATURE:</span>
            </span>
            <span
              className={`font-bold text-sm tabular-nums ${
                isAlert ? 'text-red-400' : 'text-cyan-300'
              }`}
            >
              {ambientTemp} °C
            </span>
          </div>

          <input
            type="range"
            min="15"
            max="110"
            step="1"
            value={ambientTemp}
            onChange={(e) => handleTempChange(parseInt(e.target.value, 10))}
            className="w-full h-2 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500">
            <span>15°C (Cool)</span>
            <span className="text-amber-400">50°C (Hazard Threshold)</span>
            <span>110°C (Extreme)</span>
          </div>
        </div>

        {/* Control 2: Internal Helmet Sensor Response */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HELMET INTERNAL TEMP:</span>
            </span>
            <span className="font-bold text-sm tabular-nums text-slate-100">
              {helmetTemp} °C
            </span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-lg overflow-hidden flex items-end">
            <div
              className={`h-full transition-all duration-200 ${
                isAlert ? 'bg-amber-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (helmetTemp / 80) * 100)}%` }}
            />
          </div>

          <div className="text-[10px] text-slate-500">
            Thermal insulator attenuation: -22°C convective delta.
          </div>
        </div>

        {/* Control 3: Optical HUD Luminance */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">OPTICAL WAVEGUIDE BRIGHTNESS:</span>
            <span className="font-bold text-sm text-cyan-300 tabular-nums">
              {opticalBrightness}%
            </span>
          </div>

          <input
            type="range"
            min="40"
            max="100"
            step="5"
            value={opticalBrightness}
            onChange={(e) => setOpticalBrightness(parseInt(e.target.value, 10))}
            className="w-full h-2 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="text-[10px] text-slate-500">
            Calibrated for 3,000 Nits high-contrast industrial illumination.
          </div>
        </div>
      </div>
    </div>
  );
};
