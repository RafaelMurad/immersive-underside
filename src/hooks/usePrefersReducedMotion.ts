import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Essential for accessibility - respects system preferences
 */
export function usePrefersReducedMotion(): boolean {
  // Default to true (reduced motion) for SSR safety
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
