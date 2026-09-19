import { UnitSystem } from '../types';

export function formatTemperature(celsius: number, unit: UnitSystem): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatRawTemp(celsius: number, unit: UnitSystem): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: UnitSystem): string {
  if (unit === 'fahrenheit') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirection(deg: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index] || 'N';
}

export function formatDayName(dateString: string, index: number): { dayName: string; formattedDate: string } {
  const date = new Date(dateString + 'T00:00:00');
  
  let dayName = '';
  if (index === 0) {
    dayName = 'Today';
  } else if (index === 1) {
    dayName = 'Tomorrow';
  } else {
    dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
  }

  const formattedDate = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return { dayName, formattedDate };
}
