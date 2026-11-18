import React from 'react';
import { SCENES } from '../data/showcaseData';
import { X, Clock, Camera, Volume2, ShieldCheck, Play } from 'lucide-react';

interface SceneGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScene: (seconds: number) => void;
}

export const SceneGuideModal: React.FC<SceneGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectScene,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full max-h-[85vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              Director Master Storyboard & Scene Ledger
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              45-Second Technology Showcase Breakdown
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENES.map((scene) => (
              <div
                key={scene.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      SCENE 0{scene.id}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {scene.startSec}s – {scene.endSec}s ({scene.endSec - scene.startSec}s)
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{scene.title}</h3>
                  <div className="text-xs text-cyan-300/80 font-mono mb-2">
                    {scene.subtitle}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {scene.description}
                  </p>

                  <div className="space-y-1.5 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 mb-3">
                    <div className="flex items-start gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{scene.cameraMovement}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{scene.audioCues.join(' · ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectScene(scene.startSec);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-mono font-semibold rounded-lg transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Jump to Scene {scene.id}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Negative Prompt & Production Rigor Standard */}
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Production Standards & Negative Prompt Guardrails</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Strictly enforces zero cartoon stylization, 8K commercial lighting, anonymous faceless ergonomics, correctly calibrated HUD typography, realistic metals and polymer surfaces, and restrained industrial emergency pulses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
