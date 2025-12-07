import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { usePrefersReducedMotion } from '../../hooks';

interface AnimatedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  animation?: 'fadeUp' | 'letterReveal' | 'wordReveal' | 'typewriter';
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  onComplete?: () => void;
}

/**
 * Animated text component with various reveal animations
 * Uses SplitType for character/word splitting
 */
export function AnimatedText({
  text,
  as: Component = 'p',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
  className = '',
  onComplete,
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!textRef.current || prefersReducedMotion) {
        onComplete?.();
        return;
      }

      // Split text based on animation type
      const splitTypes: Record<string, 'chars' | 'words' | 'lines' | 'chars,words'> = {
        fadeUp: 'words',
        letterReveal: 'chars',
        wordReveal: 'words',
        typewriter: 'chars',
      };

      splitRef.current = new SplitType(textRef.current, {
        types: splitTypes[animation],
      });

      const elements =
        animation === 'letterReveal' || animation === 'typewriter'
          ? splitRef.current.chars
          : splitRef.current.words;

      if (!elements) return;

      // Animation configurations
      const animations = {
        fadeUp: {
          from: { y: 40, opacity: 0 },
          to: { y: 0, opacity: 1 },
        },
        letterReveal: {
          from: { y: 100, opacity: 0, rotationX: -90 },
          to: { y: 0, opacity: 1, rotationX: 0 },
        },
        wordReveal: {
          from: { y: 60, opacity: 0, scale: 0.9 },
          to: { y: 0, opacity: 1, scale: 1 },
        },
        typewriter: {
          from: { opacity: 0, scale: 0 },
          to: { opacity: 1, scale: 1 },
        },
      };

      const config = animations[animation];

      gsap.set(elements, config.from);

      gsap.to(elements, {
        ...config.to,
        duration,
        stagger: animation === 'typewriter' ? stagger * 0.5 : stagger,
        delay,
        ease: animation === 'typewriter' ? 'power2.out' : 'power4.out',
        onComplete,
      });
    },
    { scope: textRef, dependencies: [text, animation, prefersReducedMotion] }
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      splitRef.current?.revert();
    };
  }, []);

  return (
    <Component ref={textRef as React.Ref<HTMLHeadingElement>} className={className}>
      {text}
    </Component>
  );
}
