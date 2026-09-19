import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react';
import { GeoLocationResult } from '../types';
import { searchCity, POPULAR_CITIES } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: GeoLocationResult) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  selectedCityName?: string;
}

export function SearchBar({
  onSelectCity,
  onUseCurrentLocation,
  isLocating,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search when user types 2 or more characters
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCity(query, 5);
        setSuggestions(results);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      setIsSearching(true);
      try {
        const results = await searchCity(query, 1);
        if (results.length > 0) {
          handleSelect(results[0]);
        } else {
          // Pass dummy to trigger graceful not found banner
          onSelectCity({
            name: query.trim(),
            latitude: NaN,
            longitude: NaN,
          });
        }
      } catch {
        onSelectCity({
          name: query.trim(),
          latitude: NaN,
          longitude: NaN,
        });
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSelect = (city: GeoLocationResult) => {
    setShowDropdown(false);
    setQuery('');
    onSelectCity(city);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8" ref={dropdownRef}>
      {/* Search Input Container */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Search any city or region (e.g., Tokyo, London, Seattle)..."
            autoComplete="off"
            className="w-full pl-11 pr-10 py-3.5 bg-slate-800/90 text-slate-100 placeholder-slate-400 text-sm md:text-base rounded-2xl border border-slate-700/80 focus:border-cyan-500/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-lg shadow-black/20 transition-all"
          />

          {query && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowDropdown(false);
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Use My Location Button */}
        <button
          id="geolocation-btn"
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          title="Use current GPS location"
          className="flex items-center gap-2 px-4 py-3.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 text-cyan-400 hover:text-cyan-300 rounded-2xl text-sm font-medium transition-all shadow-lg shadow-black/20 disabled:opacity-50 whitespace-nowrap"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">My Location</span>
        </button>

        {/* Search Submit Button */}
        <button
          id="search-submit-btn"
          type="submit"
          className="px-5 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] whitespace-nowrap"
        >
          Search
        </button>

        {/* Autocomplete Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            id="city-search-dropdown"
            className="absolute top-full left-0 right-0 mt-2 bg-slate-850 bg-slate-800/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-40 max-h-72 overflow-y-auto"
          >
            <div className="p-1.5 space-y-0.5">
              {suggestions.map((city, idx) => (
                <button
                  key={`${city.latitude}-${city.longitude}-${idx}`}
                  id={`suggestion-item-${idx}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-700/70 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {city.name}
                    </span>
                    {city.admin1 && (
                      <span className="text-xs text-slate-400 truncate">
                        {city.admin1}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-slate-400 shrink-0 pl-2">
                    {city.country || city.country_code || ''}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Quick City Presets */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 whitespace-nowrap font-medium flex items-center gap-1">
          Popular:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              id={`popular-city-${city.name.toLowerCase()}`}
              type="button"
              onClick={() => onSelectCity(city)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap text-xs"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
