import { MapPin, Wind, Compass, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { GeoLocationResult, CurrentWeather, DailyForecast, UnitSystem } from '../types';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatTemperature, formatWindSpeed, getWindDirection } from '../utils/unitConverter';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  location: GeoLocationResult;
  current: CurrentWeather;
  daily: DailyForecast;
  unit: UnitSystem;
}

export function CurrentWeatherCard({
  location,
  current,
  daily,
  unit,
}: CurrentWeatherCardProps) {
  const condition = getWeatherCondition(current.weathercode);
  const todayHigh = daily.temperature_2m_max?.[0] ?? current.temperature;
  const todayLow = daily.temperature_2m_min?.[0] ?? current.temperature;
  const windDirLabel = getWindDirection(current.winddirection);

  // Background subtle theme gradient based on weather condition
  const getThemeBackground = () => {
    switch (condition.category) {
      case 'clear':
        return 'from-amber-950/25 via-slate-800/90 to-slate-900/95 border-amber-500/20';
      case 'partly-cloudy':
        return 'from-sky-950/30 via-slate-800/90 to-slate-900/95 border-sky-500/20';
      case 'rain':
      case 'drizzle':
        return 'from-blue-950/35 via-slate-800/90 to-slate-900/95 border-blue-500/20';
      case 'snow':
        return 'from-cyan-950/30 via-slate-800/90 to-slate-900/95 border-cyan-500/20';
      case 'thunderstorm':
        return 'from-purple-950/35 via-slate-800/90 to-slate-900/95 border-purple-500/20';
      case 'fog':
        return 'from-slate-900 via-slate-800/90 to-slate-900/95 border-slate-600/30';
      default:
        return 'from-slate-850 via-slate-800/90 to-slate-900/95 border-slate-700/60';
    }
  };

  return (
    <div
      id="current-weather-card"
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getThemeBackground()} border p-6 md:p-8 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-300`}
    >
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side: Location info & Condition */}
        <div className="space-y-3 flex-1">
          {/* Location Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-cyan-300 border border-slate-700/70">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
              </span>
            </span>

            {location.timezone && (
              <span className="text-xs text-slate-400">
                {location.timezone.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* City Name & Country Details */}
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {location.name}
            </h2>
            <p className="text-sm font-medium text-slate-300">
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </p>
          </div>

          {/* Condition Badge & description */}
          <div className="flex items-center gap-3 pt-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/70 shadow-sm">
              <WeatherIcon
                iconName={condition.icon}
                category={condition.category}
                isDay={current.is_day}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-white">{condition.label}</span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {condition.description}
            </span>
          </div>
        </div>

        {/* Right Side: Big Temperature & Key Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800/80 pt-4 md:pt-0">
          {/* Main Temp display */}
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 shadow-inner">
              <WeatherIcon
                iconName={condition.icon}
                category={condition.category}
                isDay={current.is_day}
                className="w-12 h-12 md:w-14 md:h-14"
              />
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                {formatTemperature(current.temperature, unit)}
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mt-1">
                <span className="flex items-center text-rose-400 gap-0.5">
                  <ArrowUp className="w-3.5 h-3.5" />
                  {formatTemperature(todayHigh, unit)}
                </span>
                <span className="flex items-center text-sky-400 gap-0.5">
                  <ArrowDown className="w-3.5 h-3.5" />
                  {formatTemperature(todayLow, unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Column: Wind & Day/Night */}
          <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2.5 w-full sm:w-auto text-xs bg-slate-800/40 p-3 rounded-2xl border border-slate-700/40">
            {/* Wind Speed */}
            <div className="flex items-center gap-2 text-slate-300">
              <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Wind Speed
                </div>
                <div className="font-semibold">{formatWindSpeed(current.windspeed, unit)}</div>
              </div>
            </div>

            {/* Wind Direction */}
            <div className="flex items-center gap-2 text-slate-300">
              <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Direction
                </div>
                <div className="font-semibold">
                  {windDirLabel} ({Math.round(current.winddirection)}°)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Observed: {current.time.replace('T', ' ')} (Local)</span>
        </div>
        <div>
          <span>{current.is_day ? 'Daytime' : 'Nighttime'} conditions</span>
        </div>
      </div>
    </div>
  );
}
