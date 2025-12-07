import { useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks';

gsap.registerPlugin(ScrollTrigger);

interface StaggeredGridProps {
  children: ReactNode[];
  columns?: number;
  staggerFrom?: 'start' | 'center' | 'end' | 'random';
  animation?: 'scale' | 'slide' | 'fade';
  triggerOnScroll?: boolean;
  className?: string;
}

/**
 * Grid container with staggered entrance animations
 * Great for project cards, team members, features, etc.
 */
export function StaggeredGrid({
  children,
  columns = 3,
  staggerFrom = 'center',
  animation = 'scale',
  triggerOnScroll = true,
  className = '',
}: StaggeredGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const items = containerRef.current?.querySelectorAll('.staggered-item');
      if (!items?.length) return;

      const animations = {
        scale: {
          from: { scale: 0, opacity: 0 },
          ease: 'back.out(1.7)',
        },
        slide: {
          from: { y: 100, opacity: 0 },
          ease: 'power4.out',
        },
        fade: {
          from: { opacity: 0 },
          ease: 'power2.out',
        },
      };

      const config = animations[animation];
      const rows = Math.ceil(children.length / columns);

      gsap.set(items, config.from);

      const toVars: gsap.TweenVars = {
        duration: 0.8,
        stagger: {
          each: 0.1,
          from: staggerFrom,
          grid: [rows, columns] as [number, number],
          ease: 'power2.out',
        },
        ease: config.ease,
      };

      // Set end values based on animation type
      if (animation === 'scale') {
        toVars.scale = 1;
        toVars.opacity = 1;
      } else if (animation === 'slide') {
        toVars.y = 0;
        toVars.opacity = 1;
      } else {
        toVars.opacity = 1;
      }

      if (triggerOnScroll) {
        gsap.to(items, {
          ...toVars,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      } else {
        gsap.to(items, toVars);
      }
    },
    { scope: containerRef, dependencies: [children.length, staggerFrom, animation] }
  );

  return (
    <div
      ref={containerRef}
      className={`staggered-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 'var(--spacing-lg)',
      }}
    >
      {children.map((child, index) => (
        <div key={index} className="staggered-item">
          {child}
        </div>
      ))}
    </div>
  );
}
