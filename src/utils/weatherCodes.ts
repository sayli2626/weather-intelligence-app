import { WeatherCondition } from '../types';

export const WMO_WEATHER_MAP: Record<number, WeatherCondition> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Cloudless and bright skies',
    category: 'clear',
    icon: 'Sun',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Mostly sunny with occasional sparse clouds',
    category: 'clear',
    icon: 'SunDim',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Scattered clouds with periodic sunshine',
    category: 'partly-cloudy',
    icon: 'CloudSun',
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Thick persistent cloud coverage',
    category: 'cloudy',
    icon: 'Cloud',
  },
  45: {
    code: 45,
    label: 'Fog',
    description: 'Reduced horizontal visibility with dense fog',
    category: 'fog',
    icon: 'CloudFog',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    description: 'Freezing fog forming frost on surfaces',
    category: 'fog',
    icon: 'CloudFog',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Very light misty precipitation',
    category: 'drizzle',
    icon: 'CloudDrizzle',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Steady fine droplets falling consistently',
    category: 'drizzle',
    icon: 'CloudDrizzle',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Heavy misty rain reducing visibility',
    category: 'drizzle',
    icon: 'CloudDrizzle',
  },
  56: {
    code: 56,
    label: 'Freezing Drizzle',
    description: 'Cold drizzle freezing immediately on contact',
    category: 'drizzle',
    icon: 'CloudSnow',
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    description: 'Hazardous freezing drizzle creating slick ground',
    category: 'drizzle',
    icon: 'CloudSnow',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Gentle showers and light rain',
    category: 'rain',
    icon: 'CloudRain',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Steady rainfall requiring wet-weather protection',
    category: 'rain',
    icon: 'CloudRain',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Torrential downpour with potential water accumulation',
    category: 'rain',
    icon: 'CloudRainWind',
  },
  66: {
    code: 66,
    label: 'Freezing Rain',
    description: 'Liquid rain freezing upon surface impact',
    category: 'rain',
    icon: 'CloudHail',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Severe freezing rain causing ice glaze',
    category: 'rain',
    icon: 'CloudHail',
  },
  71: {
    code: 71,
    label: 'Slight Snow Fall',
    description: 'Light flurries and gentle snowflakes',
    category: 'snow',
    icon: 'Snowflake',
  },
  73: {
    code: 73,
    label: 'Moderate Snow Fall',
    description: 'Consistent snowfall with ground accumulation',
    category: 'snow',
    icon: 'Snowflake',
  },
  75: {
    code: 75,
    label: 'Heavy Snow Fall',
    description: 'Dense snowfall and reduced road visibility',
    category: 'snow',
    icon: 'Snowflake',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Small frozen pellet showers',
    category: 'snow',
    icon: 'Snowflake',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    description: 'Passing brief showers with dry intervals',
    category: 'rain',
    icon: 'CloudSunRain',
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Frequent passing rain bursts',
    category: 'rain',
    icon: 'CloudRain',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Sudden intense downpours with strong gusts',
    category: 'rain',
    icon: 'CloudRainWind',
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    description: 'Intermittent flurries passing through',
    category: 'snow',
    icon: 'Snowflake',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Intense snow squalls and gusting wind',
    category: 'snow',
    icon: 'Snowflake',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Thunder and lightning accompanied by rain',
    category: 'thunderstorm',
    icon: 'CloudLightning',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Hail',
    description: 'Severe thunderstorm with small ice pellets',
    category: 'thunderstorm',
    icon: 'CloudLightning',
  },
  99: {
    code: 99,
    label: 'Heavy Thunderstorm with Hail',
    description: 'Intense storm with dangerous lightning and heavy hail',
    category: 'thunderstorm',
    icon: 'CloudLightning',
  },
};

export function getWeatherCondition(code: number): WeatherCondition {
  if (WMO_WEATHER_MAP[code]) {
    return WMO_WEATHER_MAP[code];
  }
  // Fallback for uncommon code numbers
  if (code >= 95) {
    return {
      code,
      label: 'Thunderstorm',
      description: 'Thunderstorm conditions',
      category: 'thunderstorm',
      icon: 'CloudLightning',
    };
  }
  if (code >= 71) {
    return {
      code,
      label: 'Snow Conditions',
      description: 'Snow precipitation observed',
      category: 'snow',
      icon: 'Snowflake',
    };
  }
  if (code >= 51) {
    return {
      code,
      label: 'Rainy Conditions',
      description: 'Precipitation observed',
      category: 'rain',
      icon: 'CloudRain',
    };
  }
  return {
    code,
    label: 'Partly Cloudy',
    description: 'Variable cloud cover',
    category: 'partly-cloudy',
    icon: 'Cloud',
  };
}
