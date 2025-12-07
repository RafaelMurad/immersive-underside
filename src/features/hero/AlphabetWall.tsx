import { useState, useEffect, useCallback } from 'react';
import { usePrefersReducedMotion } from '../../hooks';
import './AlphabetWall.css';

interface AlphabetWallProps {
  message?: string;
  autoPlay?: boolean;
  letterDelay?: number;
  onComplete?: () => void;
  interactive?: boolean;
}

/**
 * Christmas lights alphabet wall from Stranger Things
 * Letters light up to spell messages
 */
export function AlphabetWall({
  message = 'RUN',
  autoPlay = true,
  letterDelay = 500,
  onComplete,
  interactive = false,
}: AlphabetWallProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentMessage, setCurrentMessage] = useState(message);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Light colors for each letter (like the show)
  const getLightColor = (index: number): string => {
    const colors = [
      '#ff6b6b', // red
      '#ffd93d', // yellow
      '#6bcb77', // green
      '#4d96ff', // blue
      '#ff6bcb', // pink
      '#c9b1ff', // purple
      '#ff9f43', // orange
    ];
    return colors[index % colors.length];
  };

  const playMessage = useCallback(() => {
    const chars = currentMessage.toUpperCase().split('');
    let i = 0;

    const playNext = () => {
      if (i >= chars.length) {
        setActiveIndex(-1);
        setIsPlaying(false);
        onComplete?.();
        return;
      }

      const char = chars[i];
      const charIndex = alphabet.indexOf(char);

      if (charIndex !== -1) {
        setActiveIndex(charIndex);
      } else {
        // Space or non-letter - brief pause
        setActiveIndex(-1);
      }

      i++;
      setTimeout(playNext, prefersReducedMotion ? letterDelay / 2 : letterDelay);
    };

    setIsPlaying(true);
    playNext();
  }, [currentMessage, letterDelay, onComplete, prefersReducedMotion, alphabet]);

  useEffect(() => {
    if (autoPlay && currentMessage) {
      const timer = setTimeout(playMessage, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, currentMessage, playMessage]);

  const handleLetterClick = (index: number) => {
    if (!interactive) return;
    setActiveIndex(index);
    setTimeout(() => setActiveIndex(-1), 300);
  };

  const handleReplay = () => {
    playMessage();
  };

  return (
    <div className="alphabet-wall">
      <div className="wall-background" />

      <div className="alphabet-grid">
        {alphabet.map((letter, index) => (
          <button
            key={letter}
            className={`light-bulb ${index === activeIndex ? 'lit' : ''}`}
            style={
              {
                '--light-color': getLightColor(index),
              } as React.CSSProperties
            }
            onClick={() => handleLetterClick(index)}
            disabled={!interactive}
            type="button"
            aria-label={`Letter ${letter}`}
          >
            <span className="bulb" />
            <span className="letter">{letter}</span>
          </button>
        ))}
      </div>

      {!isPlaying && (
        <button className="replay-button" onClick={handleReplay} type="button">
          Replay Message
        </button>
      )}

      {interactive && (
        <input
          type="text"
          className="message-input"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value.toUpperCase())}
          placeholder="Type a message..."
          maxLength={20}
        />
      )}
    </div>
  );
}
