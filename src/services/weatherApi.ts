import { GeoLocationResult, ForecastData } from '../types';

export async function searchCity(cityName: string, count = 5): Promise<GeoLocationResult[]> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding service error (${response.status})`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      return [];
    }

    return data.results.map((item: Record<string, unknown>) => ({
      id: Number(item.id),
      name: String(item.name || ''),
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      country: item.country ? String(item.country) : undefined,
      country_code: item.country_code ? String(item.country_code) : undefined,
      admin1: item.admin1 ? String(item.admin1) : undefined,
      admin2: item.admin2 ? String(item.admin2) : undefined,
      timezone: item.timezone ? String(item.timezone) : 'auto',
      elevation: item.elevation ? Number(item.elevation) : undefined,
    }));
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Geocoding service error')) {
      throw err;
    }
    throw new Error('Network error while searching for location. Please try again.');
  }
}

export async function getForecast(latitude: number, longitude: number): Promise<ForecastData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service returned error code ${response.status}`);
    }

    const data = await response.json();

    if (!data.current_weather || !data.daily) {
      throw new Error('Invalid or incomplete weather data received.');
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone || 'UTC',
      timezone_abbreviation: data.timezone_abbreviation,
      elevation: data.elevation,
      current_weather: {
        time: data.current_weather.time,
        temperature: Number(data.current_weather.temperature),
        windspeed: Number(data.current_weather.windspeed),
        winddirection: Number(data.current_weather.winddirection),
        weathercode: Number(data.current_weather.weathercode),
        is_day: Number(data.current_weather.is_day ?? 1),
      },
      daily: {
        time: Array.isArray(data.daily.time) ? data.daily.time : [],
        temperature_2m_max: Array.isArray(data.daily.temperature_2m_max)
          ? data.daily.temperature_2m_max.map(Number)
          : [],
        temperature_2m_min: Array.isArray(data.daily.temperature_2m_min)
          ? data.daily.temperature_2m_min.map(Number)
          : [],
        weathercode: Array.isArray(data.daily.weathercode)
          ? data.daily.weathercode.map(Number)
          : [],
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to load weather forecast data. Please check your connection.');
  }
}

export async function reverseGeocodeCoords(lat: number, lon: number): Promise<GeoLocationResult> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (response.ok) {
      const data = await response.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        name: cityName,
        country: data.countryName || undefined,
        country_code: data.countryCode || undefined,
        admin1: data.principalSubdivision || undefined,
        latitude: lat,
        longitude: lon,
      };
    }
  } catch {
    // Fallback if reverse geocode is unreachable
  }

  return {
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
  };
}

export const POPULAR_CITIES: GeoLocationResult[] = [
  {
    name: 'London',
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
    latitude: 51.5085,
    longitude: -0.1257,
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    country_code: 'JP',
    latitude: 35.6895,
    longitude: 139.6917,
  },
  {
    name: 'New York',
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: 'Paris',
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
    latitude: 48.8534,
    longitude: 2.3488,
  },
  {
    name: 'Sydney',
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    country_code: 'SG',
    latitude: 1.2897,
    longitude: 103.8501,
  },
];
