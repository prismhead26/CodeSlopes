'use client';

import { useSeasonalTheme } from '@/contexts/SeasonalThemeContext';
import { Season } from '@/lib/themes';
import {
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const SEASON_EMOJI: Record<Season, string> = {
  spring: '🌸',
  summer: '☀️',
  fall: '🍂',
  winter: '❄️',
};

const SEASON_NAMES: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
};

export default function ThemeControl() {
  const { season, mode, setSeason, toggleMode, useAutoSeason, setUseAutoSeason, theme } = useSeasonalTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Mode Toggle */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform hover:scale-110"
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {mode === 'light' ? (
          <MoonIcon className="w-5 h-5 text-gray-700" />
        ) : (
          <SunIcon className="w-5 h-5 text-yellow-400" />
        )}
      </button>

      {/* Season Selector */}
      <div className="relative group">
        <button
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform hover:scale-110 text-2xl"
          title={`Current: ${SEASON_NAMES[season]}`}
        >
          {SEASON_EMOJI[season]}
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
              Season Theme
            </div>

            {/* Auto Season Toggle */}
            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={useAutoSeason}
                onChange={(e) => setUseAutoSeason(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Auto (Current Season)</span>
            </label>

            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

            {/* Season Options */}
            {(['spring', 'summer', 'fall', 'winter'] as Season[]).map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                disabled={useAutoSeason}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                  season === s
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${useAutoSeason ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-xl">{SEASON_EMOJI[s]}</span>
                <span>{SEASON_NAMES[s]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
