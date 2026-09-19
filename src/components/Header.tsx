import { CloudSun, RotateCw } from 'lucide-react';
import { UnitSystem } from '../types';

interface HeaderProps {
  unit: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function Header({ unit, onToggleUnit, onRefresh, isLoading }: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/10">
            <CloudSun className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">Weather Intelligence</h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                Live Open-Meteo
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Precision forecasts & contextual daily planning
            </p>
          </div>
        </div>

        {/* Controls: Unit Toggle & Refresh */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unit Toggle */}
          <div
            id="unit-toggle-group"
            className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/60"
            role="group"
            aria-label="Temperature unit selection"
          >
            <button
              id="unit-celsius-btn"
              type="button"
              onClick={() => onToggleUnit('celsius')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === 'celsius'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              type="button"
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh button */}
          <button
            id="refresh-weather-btn"
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Refresh weather data"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors disabled:opacity-50"
            title="Refresh weather data"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
