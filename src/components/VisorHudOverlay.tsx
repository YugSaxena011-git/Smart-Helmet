import React, { useMemo } from 'react';
import { Shield, AlertTriangle, BatteryCharging, Radio } from 'lucide-react';

interface VisorHudOverlayProps {
  currentSecond: number;
  overrideTempRise?: boolean;
}

export const VisorHudOverlay: React.FC<VisorHudOverlayProps> = ({
  currentSecond,
  overrideTempRise = false,
}) => {
  // Determine if we are in the alert state (Scene 5: 26 to 32 seconds or user override)
  const isAlert = overrideTempRise || (currentSecond >= 26 && currentSecond < 32);

  // Compute realistic dynamic temperature progression during Scene 5
  const { ambientTemp, helmetTemp } = useMemo(() => {
    if (!isAlert) {
      return { ambientTemp: 24, helmetTemp: 27 };
    }
    // Calculate progress within 26s - 32s (or default to peak in manual mode)
    const alertProgress = overrideTempRise
      ? 1
      : Math.min(1, Math.max(0, (currentSecond - 26) / 5.5));

    // Temperature surges from 24 C to 94 C, helmet rises from 27 C to 68 C
    const currentAmbient = Math.round(24 + alertProgress * 70);
    const currentHelmet = Math.round(27 + alertProgress * 41);

    return { ambientTemp: currentAmbient, helmetTemp: currentHelmet };
  }, [currentSecond, isAlert, overrideTempRise]);

  // Battery percentage: stable 87% as requested
  const batteryLevel = 87;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-mono text-xs">
      {/* Curved Visor Edge & Ballistic Polycarbonate Optical Vignette */}
      <div className="absolute inset-0 border-[16px] border-black/40 rounded-[2.5rem] pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]" />
      
      {/* Subtle Visor Reflection Sheen */}
      <div className="absolute inset-0 visor-reflection opacity-60 pointer-events-none" />

      {/* Optical Reticle / Subtle Corner Brackets */}
      <div className="absolute top-10 left-12 w-6 h-6 border-t-2 border-l-2 border-cyan-400/40" />
      <div className="absolute top-10 right-12 w-6 h-6 border-t-2 border-r-2 border-cyan-400/40" />
      <div className="absolute bottom-10 left-12 w-6 h-6 border-b-2 border-l-2 border-cyan-400/40" />
      <div className="absolute bottom-10 right-12 w-6 h-6 border-b-2 border-r-2 border-cyan-400/40" />

      {/* HUD Top Bar: System ID & Optical Coordinates */}
      <div className="absolute top-10 left-16 right-16 flex items-center justify-between text-[11px] text-cyan-200/70 border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wider text-cyan-400">AEGIS-HUD v1.4</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">OPTICAL FOV: 38°</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-300">UWB LINK 450M</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="tabular-nums text-slate-300">LAT: 0.8ms</span>
        </div>
      </div>

      {/* CENTER HUD: CRITICAL ALERT OVERLAY (SCENE 5) */}
      {isAlert && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative max-w-md w-full bg-slate-950/85 border border-red-500/80 rounded-xl p-6 text-center backdrop-blur-md shadow-[0_0_50px_rgba(239,68,68,0.35)] animate-warning-pulse">
            {/* Alert Header Icon */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-500 animate-bounce" />
              <span className="text-sm font-bold tracking-widest text-red-400 uppercase">
                SAFETY ALERT ACTIVE
              </span>
            </div>

            {/* Primary Alert Readout */}
            <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2 font-sans">
              TEMPERATURE CRITICAL
            </h2>

            {/* Evacuation Directive */}
            <div className="inline-block px-4 py-2 bg-red-950/80 border border-red-500/90 rounded text-base font-bold tracking-wider text-red-200 uppercase mb-4">
              EVACUATE AREA
            </div>

            {/* Critical Telemetry Stream */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-red-500/30 text-left text-[11px]">
              <div>
                <span className="text-slate-400 block">AMBIENT HAZARD:</span>
                <span className="text-base font-bold text-red-400 tabular-nums">
                  {ambientTemp} °C
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">THRESHOLD LIMIT:</span>
                <span className="text-base font-bold text-amber-300 tabular-nums">
                  50.0 °C
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEFT VISOR TELEMETRY PANEL: PRIMARY OPERATOR TELEMETRY */}
      <div className="absolute top-24 left-14 max-w-xs space-y-2.5 bg-slate-950/70 p-4 rounded-lg border border-cyan-500/30 backdrop-blur-sm shadow-lg shadow-black/50">
        <div className="text-[10px] text-cyan-300/80 tracking-widest uppercase border-b border-cyan-500/20 pb-1 flex items-center justify-between">
          <span>ENVIRONMENTAL SENSORS</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* 1. AMBIENT TEMP */}
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-slate-300 text-[11px] tracking-wide">AMBIENT TEMP:</span>
          <span
            className={`text-sm font-bold tabular-nums tracking-wider ${
              isAlert ? 'text-red-400' : 'text-cyan-300'
            }`}
          >
            {ambientTemp} C
          </span>
        </div>

        {/* 2. HELMET TEMP */}
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-slate-300 text-[11px] tracking-wide">HELMET TEMP:</span>
          <span
            className={`text-sm font-bold tabular-nums tracking-wider ${
              isAlert ? 'text-amber-300' : 'text-slate-100'
            }`}
          >
            {helmetTemp} C
          </span>
        </div>

        {/* 3. SENSOR STATUS */}
        <div className="flex items-baseline justify-between gap-4 pt-1 border-t border-slate-800">
          <span className="text-slate-400 text-[11px]">SENSOR STATUS:</span>
          <span
            className={`font-semibold tracking-wider ${
              isAlert ? 'text-amber-400' : 'text-cyan-400'
            }`}
          >
            {isAlert ? 'ALERT ACTIVE' : 'ONLINE'}
          </span>
        </div>

        {/* 4. BATTERY */}
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
            <span>BATTERY:</span>
          </span>
          <span className="text-slate-100 font-bold tabular-nums">
            {batteryLevel}%
          </span>
        </div>

        {/* 5. WORKER STATUS */}
        <div className="flex items-baseline justify-between gap-4 pt-1 border-t border-slate-800">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>WORKER STATUS:</span>
          </span>
          <span
            className={`font-bold tracking-wider ${
              isAlert ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {isAlert ? 'EVACUATE' : 'SAFE'}
          </span>
        </div>
      </div>

      {/* RIGHT VISOR TELEMETRY PANEL: REAL-TIME HORIZONTAL ATTITUDE & DIAGNOSTIC SPARKS */}
      <div className="absolute top-24 right-14 max-w-xs space-y-2 bg-slate-950/70 p-4 rounded-lg border border-cyan-500/30 backdrop-blur-sm shadow-lg shadow-black/50 text-[11px]">
        <div className="text-[10px] text-cyan-300/80 tracking-widest uppercase border-b border-cyan-500/20 pb-1">
          <span>STRUCTURAL INERTIAL MATRIX</span>
        </div>

        <div className="flex justify-between items-center text-slate-300">
          <span>IMPACT VECTOR:</span>
          <span className="text-slate-100 tabular-nums">0.00 G NOMINAL</span>
        </div>

        <div className="flex justify-between items-center text-slate-300">
          <span>CHASSIS INTEGRITY:</span>
          <span className="text-emerald-400">100% SECURE</span>
        </div>

        <div className="pt-2">
          <div className="text-[10px] text-slate-400 mb-1 flex justify-between">
            <span>THERMAL PROFILE (20s)</span>
            <span className="tabular-nums">{ambientTemp}°C</span>
          </div>
          {/* Real-time mini thermal sparkline bar */}
          <div className="h-2 w-full bg-slate-900 rounded-sm overflow-hidden flex items-end">
            <div
              className={`h-full transition-all duration-300 ${
                isAlert ? 'bg-red-500' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (ambientTemp / 100) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER: LEVELING HORIZON RETICLE */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70">
        <div className="flex items-center gap-4">
          <div className="w-16 h-[1px] bg-cyan-400/50" />
          <div className="w-3 h-3 border border-cyan-400 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
          </div>
          <div className="w-16 h-[1px] bg-cyan-400/50" />
        </div>
        <span className="text-[9px] tracking-widest text-cyan-300/60 uppercase">
          STABILIZED HORIZON // REAL-TIME HUD
        </span>
      </div>
    </div>
  );
};
