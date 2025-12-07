import type { ReactNode, ElementType } from 'react';

type NeonColor = 'red' | 'pink' | 'cyan' | 'subtle';

interface NeonTextProps {
  children: ReactNode;
  color?: NeonColor;
  flickering?: boolean;
  pulsing?: boolean;
  as?: ElementType;
  className?: string;
}

/**
 * Neon glowing text component with multiple color variants
 */
export function NeonText({
  children,
  color = 'red',
  flickering = false,
  pulsing = false,
  as: Component = 'span',
  className = '',
}: NeonTextProps) {
  const colorClass = {
    red: 'neon-text',
    pink: 'neon-text-pink',
    cyan: 'neon-text-cyan',
    subtle: 'neon-text-subtle',
  }[color];

  const animationClass = flickering
    ? 'flickering-neon'
    : pulsing
    ? 'pulsing-neon'
    : '';

  return (
    <Component className={`${colorClass} ${animationClass} ${className}`}>
      {children}
    </Component>
  );
}
