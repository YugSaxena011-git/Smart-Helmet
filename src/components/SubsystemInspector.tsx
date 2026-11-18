import React, { useState } from 'react';
import { SUBSYSTEMS } from '../data/showcaseData';
import { SubsystemSpec } from '../types';
import { soundEngine } from '../audio/soundEngine';
import {
  Thermometer,
  Shield,
  Radio,
  Cpu,
  Battery,
  Glasses,
  CheckCircle,
  Activity,
  Sliders,
  Play,
  RotateCcw,
} from 'lucide-react';

interface SubsystemInspectorProps {
  initialSubsystemId?: string | null;
}

export const SubsystemInspector: React.FC<SubsystemInspectorProps> = ({
  initialSubsystemId,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialSubsystemId || SUBSYSTEMS[0].id
  );
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);

  const currentSubsystem: SubsystemSpec =
    SUBSYSTEMS.find((s) => s.id === selectedId) || SUBSYSTEMS[0];

  const getSubsystemIcon = (id: string) => {
    switch (id) {
      case 'temp-sensor':
        return <Thermometer className="w-4 h-4" />;
      case 'impact-detector':
        return <Shield className="w-4 h-4" />;
      case 'comm-module':
        return <Radio className="w-4 h-4" />;
      case 'microcontroller':
        return <Cpu className="w-4 h-4" />;
      case 'battery-pack':
        return <Battery className="w-4 h-4" />;
      case 'visor-hud':
        return <Glasses className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const runDiagnosticsTest = () => {
    soundEngine.playCalloutClick();
    setSimulationActive(true);
    setTestOutput(`Initializing ${currentSubsystem.name} diagnostic test cycle...`);

    setTimeout(() => {
      soundEngine.playPrecisionClick();
      setTestOutput(
        `Self-test passed: Nominal threshold verified. Firmware sync at 100%. Calibrated.`
      );
      setSimulationActive(false);
    }, 1200);
  };

  const handleSelect = (spec: SubsystemSpec) => {
    soundEngine.playCalloutClick();
    setSelectedId(spec.id);
    setTestOutput(null);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
            Hardware Engineering Architecture
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Integrated Subsystem Specifications
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect the six safety-critical modular subsystems integrated into the Smart Industrial Safety Helmet, including sensing arrays, edge computing units, and holographic optics.
          </p>
        </div>

        {/* Subsystem Count and Status */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>6 Active Subsystems</span>
          <span>·</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> All Systems Online
          </span>
        </div>
      </div>

      {/* Segmented Subsystem Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {SUBSYSTEMS.map((subsystem) => {
          const isSelected = subsystem.id === selectedId;
          return (
            <button
              key={subsystem.id}
              onClick={() => handleSelect(subsystem)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={isSelected ? 'text-cyan-400' : 'text-slate-500'}>
                  {getSubsystemIcon(subsystem.id)}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {subsystem.status}
                </span>
              </div>
              <div className="text-xs font-bold leading-tight line-clamp-1">
                {subsystem.shortLabel}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-1">
                {subsystem.category}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Subsystem Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        {/* Left Column: Subsystem Overview & Architectural Description */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                {getSubsystemIcon(currentSubsystem.id)}
              </div>
              <div>
                <span className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase">
                  {currentSubsystem.category}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {currentSubsystem.name}
                </h3>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-slate-400 block text-[10px]">CURRENT TELEMETRY</span>
              <span className="text-cyan-300 font-semibold">{currentSubsystem.readingValue}</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {currentSubsystem.description}
          </p>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Edge Safety Logic & Operational Principle
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentSubsystem.technicalDetails}
            </p>
          </div>

          {/* Real-time Diagnostic Simulator */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Subsystem Calibration Harness
              </span>
              <button
                onClick={runDiagnosticsTest}
                disabled={simulationActive}
                className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                {simulationActive ? (
                  <>
                    <RotateCcw className="w-3 h-3 animate-spin" /> Running...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" /> Run Diagnostics
                  </>
                )}
              </button>
            </div>

            {testOutput ? (
              <div className="text-[11px] text-emerald-400 bg-slate-900 p-2.5 rounded border border-emerald-500/30">
                {testOutput}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500">
                Ready for loopback testing. Click to execute hardware self-test diagnostic.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Engineering Specifications Table */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Technical Parameters
            </h4>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {currentSubsystem.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-slate-800"
              >
                <span className="text-slate-400 text-[11px]">{spec.label}</span>
                <span className="text-slate-100 font-semibold tabular-nums">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Compliance & Standards */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 font-mono text-[11px]">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
              Certified Compliance Standards
            </span>
            <div className="flex flex-wrap gap-2 text-slate-300">
              <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                ANSI Z89.1 Type II
              </span>
              <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                EN 397:2012+A1
              </span>
              <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                ATEX Zone 1 Ex ib
              </span>
              <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                IP67 Ingress Rated
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
