import {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudSunRain,
  CloudLightning,
  CloudSnow,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  iconName: string;
  category?: string;
  isDay?: number;
}

export function WeatherIcon({ iconName, category, isDay = 1, className, ...props }: WeatherIconProps) {
  // Color palette according to condition category
  const getCategoryColor = () => {
    switch (category) {
      case 'clear':
        return isDay ? 'text-amber-400' : 'text-indigo-300';
      case 'partly-cloudy':
        return isDay ? 'text-amber-300' : 'text-indigo-200';
      case 'cloudy':
        return 'text-slate-300';
      case 'fog':
        return 'text-slate-400';
      case 'drizzle':
      case 'rain':
        return 'text-sky-400';
      case 'snow':
        return 'text-cyan-200';
      case 'thunderstorm':
        return 'text-purple-400';
      default:
        return 'text-cyan-400';
    }
  };

  const combinedClass = `${getCategoryColor()} ${className || ''}`;

  switch (iconName) {
    case 'Sun':
      return <Sun className={combinedClass} {...props} />;
    case 'SunDim':
      return <SunDim className={combinedClass} {...props} />;
    case 'CloudSun':
      return <CloudSun className={combinedClass} {...props} />;
    case 'Cloud':
      return <Cloud className={combinedClass} {...props} />;
    case 'CloudFog':
      return <CloudFog className={combinedClass} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={combinedClass} {...props} />;
    case 'CloudRain':
      return <CloudRain className={combinedClass} {...props} />;
    case 'CloudRainWind':
      return <CloudRainWind className={combinedClass} {...props} />;
    case 'CloudHail':
      return <CloudHail className={combinedClass} {...props} />;
    case 'Snowflake':
      return <Snowflake className={combinedClass} {...props} />;
    case 'CloudSunRain':
      return <CloudSunRain className={combinedClass} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={combinedClass} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={combinedClass} {...props} />;
    default:
      return <CloudSun className={combinedClass} {...props} />;
  }
}
