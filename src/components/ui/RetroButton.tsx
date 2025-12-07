import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './RetroButton.css';

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'red' | 'cyan' | 'pink';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Retro styled button with neon glow hover effect
 */
export function RetroButton({
  children,
  variant = 'red',
  size = 'medium',
  className = '',
  ...props
}: RetroButtonProps) {
  return (
    <button
      className={`retro-button retro-button--${variant} retro-button--${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
