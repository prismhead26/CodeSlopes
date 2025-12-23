'use client';

import { useEffect, useState } from 'react';
import { useSeasonalTheme } from '@/contexts/SeasonalThemeContext';

export default function SeasonalParticles() {
  const { theme } = useSeasonalTheme();
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!theme.animation.particles) {
      setParticles([]);
      return;
    }

    const particleCount = 20;
    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      const delay = Math.random() * 10;
      const duration = theme.animation.speed === 'slow' ? 15 : theme.animation.speed === 'medium' ? 10 : 7;
      const left = Math.random() * 100;

      return (
        <div
          key={i}
          className={`particle particle-${theme.animation.particles}`}
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      );
    });

    setParticles(newParticles);
  }, [theme]);

  if (!theme.animation.particles) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles}
    </div>
  );
}
