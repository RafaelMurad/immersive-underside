import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from '../../hooks';
import './StrangerTitleSequence.css';

interface StrangerTitleSequenceProps {
  title?: string;
  subtitle?: string;
  duration?: number;
  onComplete?: () => void;
  skipEnabled?: boolean;
  autoPlay?: boolean;
}

/**
 * Full Stranger Things title sequence
 * Recreates the iconic zoom + convergence animation
 */
export function StrangerTitleSequence({
  title = 'STRANGER',
  subtitle = 'THINGS',
  duration = 10,
  onComplete,
  skipEnabled = true,
  autoPlay = true,
}: StrangerTitleSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isComplete, setIsComplete] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const titleLetters = title.split('');
  const subtitleLetters = subtitle?.split('') || [];

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
    setIsComplete(true);
    onComplete?.();
  }, [onComplete]);

  useGSAP(
    () => {
      if (prefersReducedMotion || !autoPlay) {
        gsap.set('.title-container', { scale: 1 });
        gsap.set('.title-letter, .subtitle-letter', { x: 0, y: 0, opacity: 1 });
        if (prefersReducedMotion) {
          handleComplete();
        }
        return;
      }

      const master = gsap.timeline({
        paused: !autoPlay,
        onComplete: handleComplete,
      });

      timelineRef.current = master;

      // Initial state: zoomed way in
      gsap.set('.title-container', {
        transformOrigin: '50% 50%',
        scale: 5,
      });

      // Scatter title letters randomly
      const titleLetterElements = gsap.utils.toArray<HTMLElement>('.title-letter');
      titleLetterElements.forEach((letter, i) => {
        const angle = (i / titleLetterElements.length) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        gsap.set(letter, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 1.5,
        });
      });

      // Scatter subtitle letters
      const subtitleLetterElements = gsap.utils.toArray<HTMLElement>('.subtitle-letter');
      subtitleLetterElements.forEach((letter, i) => {
        const angle = (i / subtitleLetterElements.length) * Math.PI * 2 + Math.PI;
        const distance = 100 + Math.random() * 80;
        gsap.set(letter, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 1.5,
        });
      });

      // Timeline: Fade in letters
      const fadeIn = gsap.timeline();
      fadeIn
        .to('.title-letter', {
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.in',
        })
        .to(
          '.subtitle-letter',
          {
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.in',
          },
          '-=0.3'
        );

      // Timeline: Zoom out
      const zoom = gsap.timeline();
      zoom.to('.title-container', {
        scale: 0.9,
        duration: duration * 0.8,
        ease: 'power1.in',
      });

      // Timeline: Converge letters
      const converge = gsap.timeline();
      converge
        .to('.title-letter', {
          x: 0,
          y: 0,
          scale: 1,
          duration: duration * 0.7,
          ease: 'power2.out',
          stagger: 0.02,
        })
        .to(
          '.subtitle-letter',
          {
            x: 0,
            y: 0,
            scale: 1,
            duration: duration * 0.6,
            ease: 'power2.out',
            stagger: 0.02,
          },
          '<0.2'
        );

      // Timeline: Intensify glow
      const glow = gsap.timeline();
      glow.to('.title-text', {
        textShadow: `
          0 0 10px #fff,
          0 0 20px #fff,
          0 0 30px #fff,
          0 0 40px #ff1e1e,
          0 0 70px #ff1e1e,
          0 0 80px #ff1e1e,
          0 0 100px #ff1e1e,
          0 0 150px #ff1e1e
        `,
        duration: duration * 0.6,
        ease: 'power2.in',
      });

      // Final flash
      const flash = gsap.timeline();
      flash
        .to('.sequence-overlay', {
          opacity: 1,
          duration: 0.1,
        })
        .to('.sequence-overlay', {
          opacity: 0,
          duration: 0.5,
        });

      // Assemble master timeline
      master
        .add(fadeIn, 0)
        .add(zoom, 0.5)
        .add(converge, 0.5)
        .add(glow, 1)
        .add(flash, duration - 0.6);
    },
    { scope: containerRef, dependencies: [autoPlay, duration, prefersReducedMotion] }
  );

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1);
    }
  };

  if (isComplete && !isPlaying) {
    return null;
  }

  return (
    <div ref={containerRef} className="stranger-sequence">
      <div className="sequence-overlay" />

      <div className="title-container">
        <div className="title-text title-row">
          {titleLetters.map((letter, i) => (
            <span key={`title-${i}`} className="title-letter">
              {letter}
            </span>
          ))}
        </div>

        {subtitle && (
          <div className="subtitle-text title-row">
            {subtitleLetters.map((letter, i) => (
              <span key={`subtitle-${i}`} className="subtitle-letter">
                {letter}
              </span>
            ))}
          </div>
        )}
      </div>

      {skipEnabled && isPlaying && !prefersReducedMotion && (
        <button className="sequence-skip" onClick={handleSkip} type="button">
          Skip Intro
        </button>
      )}
    </div>
  );
}
