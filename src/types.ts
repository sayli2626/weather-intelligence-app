export interface GeoLocationResult {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
}

export interface ForecastData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  elevation?: number;
  current_weather: CurrentWeather;
  daily: DailyForecast;
}

export type UnitSystem = 'celsius' | 'fahrenheit';

export interface WeatherCondition {
  code: number;
  label: string;
  description: string;
  category: 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  icon: string;
}

export interface RecommendationItem {
  id: string;
  category: 'clothing' | 'accessory' | 'footwear' | 'advisory';
  title: string;
  detail: string;
  icon: string;
  importance: 'essential' | 'recommended' | 'optional';
}

export interface ActivityGuidance {
  outdoorViability: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Stay Indoors';
  viabilityColor: string;
  summary: string;
  suitableActivities: string[];
  cautions: string[];
}

export interface PlanningInsights {
  comfortLevel: string;
  comfortSummary: string;
  recommendations: RecommendationItem[];
  activityGuidance: ActivityGuidance;
}
