import { Wind, Compass, Mountain, ThermometerSnowflake, Globe } from 'lucide-react';
import { CurrentWeather, DailyForecast, GeoLocationResult, UnitSystem } from '../types';
import { formatWindSpeed, formatTemperature, getWindDirection } from '../utils/unitConverter';

interface WeatherStatsGridProps {
  location: GeoLocationResult;
  current: CurrentWeather;
  daily: DailyForecast;
  unit: UnitSystem;
}

export function WeatherStatsGrid({ location, current, daily, unit }: WeatherStatsGridProps) {
  const windDirLabel = getWindDirection(current.winddirection);
  const todayHigh = daily.temperature_2m_max[0] ?? current.temperature;
  const todayLow = daily.temperature_2m_min[0] ?? current.temperature;
  const tempSpread = Math.abs(todayHigh - todayLow);

  const stats = [
    {
      id: 'stat-wind',
      label: 'Wind Speed',
      value: formatWindSpeed(current.windspeed, unit),
      subtext: `Direction ${windDirLabel} (${Math.round(current.winddirection)}°)`,
      icon: <Wind className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'stat-wind-dir',
      label: 'Compass Bearing',
      value: `${windDirLabel} · ${Math.round(current.winddirection)}°`,
      subtext: 'Surface air current',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'stat-spread',
      label: "Today's Temperature Spread",
      value: formatTemperature(tempSpread, unit),
      subtext: `Low: ${formatTemperature(todayLow, unit)} / High: ${formatTemperature(todayHigh, unit)}`,
      icon: <ThermometerSnowflake className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'stat-location',
      label: 'Elevation & Zone',
      value: location.elevation !== undefined ? `${Math.round(location.elevation)} m` : 'Sea level',
      subtext: location.timezone ? location.timezone.replace('_', ' ') : 'Local Time',
      icon: location.elevation ? <Mountain className="w-4 h-4 text-indigo-400" /> : <Globe className="w-4 h-4 text-indigo-400" />,
    },
  ];

  return (
    <div id="weather-stats-grid" className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
      {stats.map((item) => (
        <div
          key={item.id}
          id={item.id}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{item.label}</span>
            <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
              {item.icon}
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">{item.value}</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
