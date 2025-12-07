import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from '../../hooks';
import './StrangerIntro.css';

interface StrangerIntroProps {
  onComplete?: () => void;
  skipEnabled?: boolean;
}

/**
 * Stranger Things title intro sequence
 * Letters start scattered and converge while zooming out
 */
export function StrangerIntro({ onComplete, skipEnabled = true }: StrangerIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        // Skip animation for reduced motion preference
        gsap.set('.stranger-title-container', { scale: 1 });
        gsap.set('.stranger-letter', { x: 0, y: 0, opacity: 1 });
        onComplete?.();
        return;
      }

      const master = gsap.timeline({
        onComplete: () => {
          setIsPlaying(false);
          onComplete?.();
        },
      });

      timelineRef.current = master;

      // Initial state: zoomed in, letters scattered
      gsap.set('.stranger-title-container', {
        transformOrigin: '50% 50%',
        scale: 5,
      });

      // Scatter letters in different directions
      const letterPositions = [
        { x: -200, y: -150 }, // S
        { x: 150, y: -200 },  // T
        { x: -180, y: 100 },  // R
        { x: 200, y: 150 },   // A
        { x: -150, y: -100 }, // N
        { x: 100, y: 200 },   // G
        { x: -120, y: -180 }, // E
        { x: 180, y: -120 },  // R2
      ];

      const letters = document.querySelectorAll('.stranger-letter');
      letters.forEach((letter, i) => {
        gsap.set(letter, {
          x: letterPositions[i]?.x || 0,
          y: letterPositions[i]?.y || 0,
          opacity: 0,
        });
      });

      // Fade in letters
      const fadeInTL = gsap.timeline();
      fadeInTL.to('.stranger-letter', {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.in',
      });

      // Zoom timeline - exponential ease for that cinematic feel
      const zoomTL = gsap.timeline();
      zoomTL.to('.stranger-title-container', {
        scale: 0.8,
        duration: 8,
        ease: 'power1.in',
      });

      // Letter convergence timeline
      const lettersTL = gsap.timeline();
      letters.forEach((letter) => {
        lettersTL.to(
          letter,
          {
            x: 0,
            y: 0,
            duration: 7,
            ease: 'power2.out',
          },
          0
        );
      });

      // Glow intensification
      const glowTL = gsap.timeline();
      glowTL.to('.stranger-title-container', {
        textShadow:
          '0 0 10px #fff, 0 0 20px #fff, 0 0 40px #ff1e1e, 0 0 80px #ff1e1e, 0 0 120px #ff1e1e',
        duration: 6,
        ease: 'power2.in',
      });

      // Combine all timelines
      master
        .add(fadeInTL, 0)
        .add(zoomTL, 0.5)
        .add(lettersTL, 0.5)
        .add(glowTL, 1);
    },
    { scope: containerRef }
  );

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1);
    }
  };

  return (
    <div ref={containerRef} className="stranger-intro">
      <div className="stranger-title-container">
        <div className="stranger-title-row">
          <span className="stranger-letter">S</span>
          <span className="stranger-letter">T</span>
          <span className="stranger-letter">R</span>
          <span className="stranger-letter">A</span>
          <span className="stranger-letter">N</span>
          <span className="stranger-letter">G</span>
          <span className="stranger-letter">E</span>
          <span className="stranger-letter">R</span>
        </div>
      </div>

      {skipEnabled && isPlaying && !prefersReducedMotion && (
        <button className="skip-intro-button" onClick={handleSkip} type="button">
          Skip Intro
        </button>
      )}
    </div>
  );
}
