export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type ThemeMode = 'light' | 'dark';

export interface SeasonalTheme {
  season: Season;
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    gradient: string;
  };
  animation: {
    particles?: 'snow' | 'leaves' | 'petals' | 'fireflies';
    speed: 'slow' | 'medium' | 'fast';
  };
}

export const SEASONAL_THEMES: Record<Season, SeasonalTheme> = {
  spring: {
    season: 'spring',
    mode: 'light',
    colors: {
      primary: '#10b981', // Green
      secondary: '#f59e0b', // Yellow
      accent: '#ec4899', // Pink
      background: '#fef3c7', // Light cream
      foreground: '#1f2937', // Dark gray
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #dbeafe 100%)',
    },
    animation: {
      particles: 'petals',
      speed: 'slow',
    },
  },
  summer: {
    season: 'summer',
    mode: 'light',
    colors: {
      primary: '#3b82f6', // Bright blue
      secondary: '#f59e0b', // Sun yellow
      accent: '#06b6d4', // Cyan
      background: '#dbeafe', // Light blue
      foreground: '#1e3a8a', // Deep blue
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #fef3c7 100%)',
    },
    animation: {
      particles: 'fireflies',
      speed: 'medium',
    },
  },
  fall: {
    season: 'fall',
    mode: 'light',
    colors: {
      primary: '#ea580c', // Orange
      secondary: '#b45309', // Brown
      accent: '#dc2626', // Red
      background: '#fed7aa', // Light orange
      foreground: '#451a03', // Dark brown
      gradient: 'linear-gradient(135deg, #fed7aa 0%, #fef3c7 100%)',
    },
    animation: {
      particles: 'leaves',
      speed: 'medium',
    },
  },
  winter: {
    season: 'winter',
    mode: 'dark',
    colors: {
      primary: '#60a5fa', // Ice blue
      secondary: '#8b5cf6', // Purple
      accent: '#06b6d4', // Cyan
      background: '#0f172a', // Dark blue-gray
      foreground: '#f1f5f9', // Light gray
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    },
    animation: {
      particles: 'snow',
      speed: 'slow',
    },
  },
};

export function getCurrentSeason(): Season {
  const month = new Date().getMonth();

  if (month >= 2 && month <= 4) return 'spring'; // March-May
  if (month >= 5 && month <= 7) return 'summer'; // June-August
  if (month >= 8 && month <= 10) return 'fall'; // September-November
  return 'winter'; // December-February
}

export function getSeasonalTheme(season?: Season, mode?: ThemeMode): SeasonalTheme {
  const currentSeason = season || getCurrentSeason();
  const theme = SEASONAL_THEMES[currentSeason];

  if (mode && mode !== theme.mode) {
    // Adjust colors for opposite mode
    return {
      ...theme,
      mode,
      colors: mode === 'dark' ? getDarkModeColors(theme) : theme.colors,
    };
  }

  return theme;
}

function getDarkModeColors(theme: SeasonalTheme): SeasonalTheme['colors'] {
  // Convert light theme to dark theme colors
  return {
    ...theme.colors,
    background: '#0f172a',
    foreground: '#f1f5f9',
    gradient: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
  };
}
