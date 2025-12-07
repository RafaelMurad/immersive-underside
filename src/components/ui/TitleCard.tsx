import type { ReactNode } from 'react';
import './TitleCard.css';

interface TitleCardProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  variant?: 'default' | 'upside-down';
}

/**
 * Title card combining neon glow, CRT overlay, and film grain effects
 * The signature Stranger Things aesthetic
 */
export function TitleCard({
  title,
  subtitle,
  children,
  variant = 'default',
}: TitleCardProps) {
  return (
    <div
      className={`title-card crt-overlay film-grain vignette ${
        variant === 'upside-down' ? 'upside-down-filter' : ''
      }`}
    >
      <div className="title-card__content">
        <h1 className="title-card__title neon-text">{title}</h1>
        {subtitle && (
          <p className="title-card__subtitle glitch" data-text={subtitle}>
            {subtitle}
          </p>
        )}
        {children && <div className="title-card__body">{children}</div>}
      </div>
    </div>
  );
}
