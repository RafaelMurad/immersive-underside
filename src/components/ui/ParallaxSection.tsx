import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
}

/**
 * Parallax section wrapper using Framer Motion
 * Content moves at different speed than scroll
 */
export function ParallaxSection({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yRange = direction === 'up' ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed];
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className={`parallax-section ${className}`} style={{ overflow: 'hidden' }}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  );
}

interface ParallaxHeroProps {
  children: ReactNode;
  backgroundContent?: ReactNode;
  height?: string;
  className?: string;
}

/**
 * Hero section with multi-layer parallax effect
 * Background moves slower, creating depth
 */
export function ParallaxHero({
  children,
  backgroundContent,
  height = '100vh',
  className = '',
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const smoothBgY = useSpring(backgroundY, { stiffness: 100, damping: 30 });
  const smoothContentY = useSpring(contentY, { stiffness: 100, damping: 30 });

  return (
    <div
      ref={ref}
      className={`parallax-hero ${className}`}
      style={{
        position: 'relative',
        height,
        overflow: 'hidden',
      }}
    >
      {backgroundContent && (
        <motion.div
          className="parallax-hero__background"
          style={{
            y: smoothBgY,
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          {backgroundContent}
        </motion.div>
      )}
      <motion.div
        className="parallax-hero__content"
        style={{
          y: smoothContentY,
          opacity,
          scale,
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ParallaxLayersProps {
  layers: {
    content: ReactNode;
    speed: number;
    zIndex?: number;
  }[];
  height?: string;
  className?: string;
}

/**
 * Multi-layer parallax with configurable speeds per layer
 * Lower speed = slower movement = appears further away
 */
export function ParallaxLayers({ layers, height = '100vh', className = '' }: ParallaxLayersProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  return (
    <div
      ref={ref}
      className={`parallax-layers ${className}`}
      style={{
        position: 'relative',
        height,
        overflow: 'hidden',
      }}
    >
      {layers.map((layer, index) => {
        const y = useTransform(scrollYProgress, [0, 1], [0, -200 * layer.speed]);
        const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

        return (
          <motion.div
            key={index}
            className={`parallax-layer parallax-layer--${index}`}
            style={{
              y: smoothY,
              position: 'absolute',
              inset: 0,
              zIndex: layer.zIndex ?? index,
            }}
          >
            {layer.content}
          </motion.div>
        );
      })}
    </div>
  );
}
