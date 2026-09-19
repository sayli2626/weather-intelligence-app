import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { GeoLocationResult, ForecastData, UnitSystem } from './types';
import { getForecast, searchCity, reverseGeocodeCoords, POPULAR_CITIES } from './services/weatherApi';
import { generatePlanningInsights } from './utils/recommendations';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ErrorBanner } from './components/ErrorBanner';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { PlanningRecommendationsCard } from './components/PlanningRecommendationsCard';
import { WeatherStatsGrid } from './components/WeatherStatsGrid';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeoLocationResult>(POPULAR_CITIES[0]); // Default London
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [unit, setUnit] = useState<UnitSystem>('celsius');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load weather for location
  const loadWeather = useCallback(async (location: GeoLocationResult) => {
    // If invalid coordinates were passed (from search failure)
    if (isNaN(location.latitude) || isNaN(location.longitude)) {
      setErrorMessage(`City '${location.name}' not found. Please verify spelling and try again.`);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getForecast(location.latitude, location.longitude);
      setForecast(data);
      setSelectedLocation(location);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to retrieve weather forecast.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(POPULAR_CITIES[0]);
  }, [loadWeather]);

  // Handle city selection from search or quick buttons
  const handleSelectCity = async (city: GeoLocationResult) => {
    if (isNaN(city.latitude) || isNaN(city.longitude)) {
      // User typed custom string, let's search via API first
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const results = await searchCity(city.name, 1);
        if (results && results.length > 0) {
          loadWeather(results[0]);
        } else {
          setErrorMessage(`City '${city.name}' not found. Please try another city.`);
          setIsLoading(false);
        }
      } catch {
        setErrorMessage(`City '${city.name}' not found. Please try another city.`);
        setIsLoading(false);
      }
    } else {
      loadWeather(city);
    }
  };

  // Browser Geolocation integration
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const locDetails = await reverseGeocodeCoords(latitude, longitude);
          await loadWeather(locDetails);
        } catch {
          await loadWeather({
            name: 'My Location',
            latitude,
            longitude,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Location access was denied. Please search for your city in the search bar.');
        } else if (error.code === error.TIMEOUT) {
          setErrorMessage('Location request timed out. Please try searching for your city manually.');
        } else {
          setErrorMessage('Unable to retrieve your current location. Please search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Refresh current city
  const handleRefresh = () => {
    if (selectedLocation) {
      loadWeather(selectedLocation);
    }
  };

  // Planning insights based on current weather
  const planningInsights = forecast
    ? generatePlanningInsights(
        forecast.current_weather.temperature,
        forecast.current_weather.weathercode,
        forecast.current_weather.windspeed,
        forecast.current_weather.is_day
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* App Header */}
      <Header
        unit={unit}
        onToggleUnit={setUnit}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar with Popular City Shortcuts */}
        <SearchBar
          onSelectCity={handleSelectCity}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          selectedCityName={selectedLocation?.name}
        />

        {/* Error Banner with Dismiss & Retry */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorBanner
                message={errorMessage}
                onDismiss={() => setErrorMessage(null)}
                onRetry={handleRefresh}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay or State */}
        {isLoading && !forecast && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <p className="text-sm font-medium text-slate-400">
              Gathering atmospheric data for {selectedLocation.name}...
            </p>
          </div>
        )}

        {/* Weather Dashboard */}
        {forecast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Primary Current Weather Card */}
            <CurrentWeatherCard
              location={selectedLocation}
              current={forecast.current_weather}
              daily={forecast.daily}
              unit={unit}
            />

            {/* Key Atmospheric Stats Grid */}
            <WeatherStatsGrid
              location={selectedLocation}
              current={forecast.current_weather}
              daily={forecast.daily}
              unit={unit}
            />

            {/* 2-Column Responsive Layout: 7-Day Forecast & Planning Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* 7-Day Forecast */}
              <ForecastCard daily={forecast.daily} unit={unit} />

              {/* Contextual Planning & Recommendations */}
              {planningInsights && (
                <PlanningRecommendationsCard insights={planningInsights} />
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            Weather Intelligence App · Powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2"
            >
              Open-Meteo API
            </a>{' '}
            (No API keys required)
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>WMO Standards</span>
            <span>·</span>
            <span>Real-time Geocoding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
