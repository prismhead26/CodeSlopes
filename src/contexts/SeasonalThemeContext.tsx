'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Season, ThemeMode, SeasonalTheme, getCurrentSeason, getSeasonalTheme } from '@/lib/themes';

interface SeasonalThemeContextType {
  season: Season;
  mode: ThemeMode;
  theme: SeasonalTheme;
  setSeason: (season: Season) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  useAutoSeason: boolean;
  setUseAutoSeason: (auto: boolean) => void;
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType | undefined>(undefined);

export function SeasonalThemeProvider({ children }: { children: React.ReactNode }) {
  const [season, setSeasonState] = useState<Season>('spring');
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [useAutoSeason, setUseAutoSeasonState] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    setMounted(true);

    const storedSeason = localStorage.getItem('season') as Season | null;
    const storedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    const storedAutoSeason = localStorage.getItem('useAutoSeason');

    const auto = storedAutoSeason !== 'false';
    setUseAutoSeasonState(auto);

    if (auto) {
      const currentSeason = getCurrentSeason();
      setSeasonState(currentSeason);
    } else if (storedSeason) {
      setSeasonState(storedSeason);
    }

    if (storedMode) {
      setModeState(storedMode);
      document.documentElement.classList.toggle('dark', storedMode === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialMode = prefersDark ? 'dark' : 'light';
      setModeState(initialMode);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const setSeason = (newSeason: Season) => {
    setSeasonState(newSeason);
    localStorage.setItem('season', newSeason);
    setUseAutoSeasonState(false);
    localStorage.setItem('useAutoSeason', 'false');
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('themeMode', newMode);
    document.documentElement.classList.toggle('dark', newMode === 'dark');
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const setUseAutoSeason = (auto: boolean) => {
    setUseAutoSeasonState(auto);
    localStorage.setItem('useAutoSeason', auto.toString());
    if (auto) {
      const currentSeason = getCurrentSeason();
      setSeasonState(currentSeason);
      localStorage.setItem('season', currentSeason);
    }
  };

  const theme = getSeasonalTheme(season, mode);

  // Apply theme colors to CSS variables
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-foreground', theme.colors.foreground);
    root.style.setProperty('--theme-gradient', theme.colors.gradient);
  }, [theme, mounted]);

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <SeasonalThemeContext.Provider
      value={{
        season,
        mode,
        theme,
        setSeason,
        setMode,
        toggleMode,
        useAutoSeason,
        setUseAutoSeason,
      }}
    >
      {children}
    </SeasonalThemeContext.Provider>
  );
}

export function useSeasonalTheme() {
  const context = useContext(SeasonalThemeContext);
  if (context === undefined) {
    throw new Error('useSeasonalTheme must be used within a SeasonalThemeProvider');
  }
  return context;
}
