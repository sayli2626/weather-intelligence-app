import { CalendarDays, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyForecast, UnitSystem } from '../types';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatTemperature, formatDayName } from '../utils/unitConverter';
import { WeatherIcon } from './WeatherIcon';

interface ForecastCardProps {
  daily: DailyForecast;
  unit: UnitSystem;
}

export function ForecastCard({ daily, unit }: ForecastCardProps) {
  const daysCount = Math.min(daily.time.length, 7);
  const items = [];

  // Find min and max for the whole 7-day period for the relative visual bar
  let overallMin = Infinity;
  let overallMax = -Infinity;

  for (let i = 0; i < daysCount; i++) {
    const minT = daily.temperature_2m_min[i] ?? 0;
    const maxT = daily.temperature_2m_max[i] ?? 0;
    if (minT < overallMin) overallMin = minT;
    if (maxT > overallMax) overallMax = maxT;
  }

  const rangeSpan = Math.max(overallMax - overallMin, 1);

  for (let i = 0; i < daysCount; i++) {
    const dateStr = daily.time[i];
    const maxT = daily.temperature_2m_max[i];
    const minT = daily.temperature_2m_min[i];
    const code = daily.weathercode[i];
    const condition = getWeatherCondition(code);
    const { dayName, formattedDate } = formatDayName(dateStr, i);

    // Calculate percent bar positions
    const leftPercent = Math.max(0, Math.min(100, ((minT - overallMin) / rangeSpan) * 100));
    const rightPercent = Math.max(0, Math.min(100, ((maxT - overallMin) / rangeSpan) * 100));
    const barWidth = Math.max(rightPercent - leftPercent, 8);

    items.push({
      dateStr,
      dayName,
      formattedDate,
      maxT,
      minT,
      condition,
      leftPercent,
      barWidth,
    });
  }

  return (
    <div
      id="7-day-forecast-card"
      className="rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 md:p-7 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
              7-Day Forecast
            </h3>
            <p className="text-xs text-slate-400">
              Daily trajectory and temperature ranges
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-400 flex items-center gap-3">
          <span className="flex items-center gap-1 text-sky-400">
            <ArrowDown className="w-3 h-3" /> Min
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <ArrowUp className="w-3 h-3" /> Max
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.dateStr}
            id={`forecast-day-row-${index}`}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/40 transition-colors gap-3"
          >
            {/* Day and Date */}
            <div className="w-24 sm:w-28 shrink-0">
              <div className="font-bold text-sm text-white">{item.dayName}</div>
              <div className="text-xs text-slate-400">{item.formattedDate}</div>
            </div>

            {/* Condition Icon and Title */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="shrink-0 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                <WeatherIcon
                  iconName={item.condition.icon}
                  category={item.condition.category}
                  className="w-5 h-5"
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-300 truncate hidden sm:inline">
                {item.condition.label}
              </span>
            </div>

            {/* Min temp */}
            <div className="w-12 text-right text-xs sm:text-sm font-semibold text-slate-400 shrink-0">
              {formatTemperature(item.minT, unit)}
            </div>

            {/* Visual range bar */}
            <div className="w-24 sm:w-32 hidden md:block h-2 bg-slate-700/50 rounded-full relative overflow-hidden shrink-0">
              <div
                className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 to-rose-400 rounded-full opacity-80"
                style={{
                  left: `${item.leftPercent}%`,
                  width: `${item.barWidth}%`,
                }}
              />
            </div>

            {/* Max temp */}
            <div className="w-12 text-right text-xs sm:text-sm font-bold text-white shrink-0">
              {formatTemperature(item.maxT, unit)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
