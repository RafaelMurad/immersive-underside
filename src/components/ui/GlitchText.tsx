import { createElement } from 'react';

interface GlitchTextProps {
  text: string;
  hoverOnly?: boolean;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  className?: string;
}

/**
 * Glitch effect text with chromatic aberration
 * Uses data-text attribute for pseudo-element content
 */
export function GlitchText({
  text,
  hoverOnly = false,
  as = 'span',
  className = '',
}: GlitchTextProps) {
  const glitchClass = hoverOnly ? 'glitch glitch-hover' : 'glitch';

  return createElement(
    as,
    {
      className: `${glitchClass} ${className}`,
      'data-text': text,
    },
    text
  );
}
