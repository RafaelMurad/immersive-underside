import { useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks';

gsap.registerPlugin(ScrollTrigger);

type RevealAnimation = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'blur';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  className?: string;
}

/**
 * Scroll-triggered reveal animation wrapper
 * Uses GSAP ScrollTrigger for precise control
 */
export function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  start = 'top 80%',
  end = 'top 30%',
  scrub = false,
  markers = false,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const element = ref.current;
      if (!element) return;

      const animations: Record<RevealAnimation, gsap.TweenVars> = {
        fadeUp: { y: 60, opacity: 0 },
        fadeIn: { opacity: 0 },
        slideLeft: { x: -100, opacity: 0 },
        slideRight: { x: 100, opacity: 0 },
        scale: { scale: 0.8, opacity: 0 },
        blur: { filter: 'blur(10px)', opacity: 0 },
      };

      const fromVars = animations[animation];

      gsap.from(element, {
        ...fromVars,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          markers,
          toggleActions: scrub ? undefined : 'play none none reverse',
        },
      });
    },
    { scope: ref, dependencies: [animation, delay, duration, start, end, scrub] }
  );

  return (
    <div ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}

interface HorizontalScrollProps {
  children: ReactNode[];
  className?: string;
}

/**
 * Horizontal scroll section with pinning
 * Scroll vertically to move content horizontally
 */
export function HorizontalScroll({ children, className = '' }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const panels = panelsRef.current;
      if (!panels) return;

      const panelElements = gsap.utils.toArray<HTMLElement>(panels.children);

      gsap.to(panelElements, {
        xPercent: -100 * (panelElements.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panelElements.length - 1),
          end: () => `+=${panels.offsetWidth}`,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`horizontal-scroll ${className}`}>
      <div
        ref={panelsRef}
        className="horizontal-scroll__panels"
        style={{
          display: 'flex',
          width: `${children.length * 100}vw`,
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="horizontal-scroll__panel"
            style={{
              width: '100vw',
              height: '100vh',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
