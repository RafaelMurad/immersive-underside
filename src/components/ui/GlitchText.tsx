import type { ElementType } from 'react';

interface GlitchTextProps {
  text: string;
  hoverOnly?: boolean;
  as?: ElementType;
  className?: string;
}

/**
 * Glitch effect text with chromatic aberration
 * Uses data-text attribute for pseudo-element content
 */
export function GlitchText({
  text,
  hoverOnly = false,
  as: Component = 'span',
  className = '',
}: GlitchTextProps) {
  const glitchClass = hoverOnly ? 'glitch glitch-hover' : 'glitch';

  return (
    <Component className={`${glitchClass} ${className}`} data-text={text}>
      {text}
    </Component>
  );
}
