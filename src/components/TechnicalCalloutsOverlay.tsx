import React, { useState } from 'react';
import { SUBSYSTEMS } from '../data/showcaseData';
import { SubsystemSpec } from '../types';
import { soundEngine } from '../audio/soundEngine';
import { Info, X, CheckCircle2 } from 'lucide-react';

interface TechnicalCalloutsOverlayProps {
  onSelectSubsystem?: (subsystem: SubsystemSpec) => void;
  selectedSubsystemId?: string | null;
}

export const TechnicalCalloutsOverlay: React.FC<TechnicalCalloutsOverlayProps> = ({
  onSelectSubsystem,
  selectedSubsystemId,
}) => {
  const [activeCallout, setActiveCallout] = useState<SubsystemSpec | null>(null);

  const handleCalloutClick = (spec: SubsystemSpec) => {
    soundEngine.playCalloutClick();
    if (activeCallout?.id === spec.id) {
      setActiveCallout(null);
    } else {
      setActiveCallout(spec);
      if (onSelectSubsystem) {
        onSelectSubsystem(spec);
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-auto">
      {/* 6 Technical Callout Pins */}
      {SUBSYSTEMS.map((subsystem, index) => {
        const isSelected = selectedSubsystemId === subsystem.id || activeCallout?.id === subsystem.id;

        return (
          <div
            key={subsystem.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group z-30"
            style={{
              left: `${subsystem.xPercent}%`,
              top: `${subsystem.yPercent}%`,
            }}
          >
            {/* Interactive Target Circle */}
            <button
              onClick={() => handleCalloutClick(subsystem)}
              className="relative flex items-center justify-center p-2 focus:outline-none"
              aria-label={`Inspect ${subsystem.name}`}
            >
              {/* Outer pulsing ring */}
              <span className="absolute w-8 h-8 rounded-full border border-cyan-400/60 animate-ping opacity-75" />
              {/* Middle boundary */}
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
                  isSelected
                    ? 'border-cyan-300 bg-cyan-500/40 shadow-cyan-500/50 scale-125'
                    : 'border-cyan-400/80 bg-slate-950/80 group-hover:scale-110 group-hover:border-white'
                }`}
              >
                {/* Core dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              </span>
            </button>

            {/* Label Card with connecting leader line */}
            <div
              className={`absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 pointer-events-auto ${
                isSelected ? 'opacity-100 scale-100' : 'opacity-90 group-hover:opacity-100'
              }`}
            >
              <div
                onClick={() => handleCalloutClick(subsystem)}
                className={`cursor-pointer px-3 py-1.5 rounded-md border text-[11px] font-mono tracking-wide backdrop-blur-md shadow-lg transition-all ${
                  isSelected
                    ? 'bg-slate-900/95 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/50'
                    : 'bg-slate-950/85 border-slate-700/80 text-slate-200 hover:border-cyan-400/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-cyan-400 font-bold">0{index + 1}</span>
                  <span className="font-semibold">{subsystem.name}</span>
                  <span className="text-[10px] text-emerald-400/90 font-sans">· {subsystem.status}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Floating Detailed Spec Drawer if Callout is clicked */}
      {activeCallout && (
        <div className="absolute bottom-6 right-6 max-w-sm w-full bg-slate-950/95 border border-cyan-500/40 rounded-xl p-5 backdrop-blur-xl shadow-2xl z-40 text-xs font-sans animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  {activeCallout.category}
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  {activeCallout.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {activeCallout.name}
              </h3>
            </div>
            <button
              onClick={() => setActiveCallout(null)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-300 py-3 text-xs leading-relaxed">
            {activeCallout.description}
          </p>

          <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-800 font-mono text-[11px]">
            {activeCallout.specs.map((spec) => (
              <div key={spec.label} className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[9px] uppercase">{spec.label}</span>
                <span className="text-cyan-300 font-semibold">{spec.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 text-[11px] text-slate-400 leading-normal flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{activeCallout.technicalDetails}</span>
          </div>
        </div>
      )}
    </div>
  );
};
