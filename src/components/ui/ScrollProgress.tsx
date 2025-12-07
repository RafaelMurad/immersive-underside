import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressProps {
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
  className?: string;
}

/**
 * Fixed scroll progress bar with neon glow
 */
export function ScrollProgress({
  color = 'var(--st-red)',
  height = 4,
  position = 'top',
  className = '',
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`scroll-progress ${className}`}
      style={{
        position: 'fixed',
        [position]: 0,
        left: 0,
        right: 0,
        height,
        background: color,
        transformOrigin: 'left',
        scaleX,
        zIndex: 9999,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      }}
    />
  );
}

interface ScrollIndicatorProps {
  showPercentage?: boolean;
  color?: string;
  className?: string;
}

/**
 * Circular scroll progress indicator
 */
export function ScrollIndicator({
  showPercentage = true,
  color = 'var(--st-red)',
  className = '',
}: ScrollIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={`scroll-indicator ${className}`}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
      }}
    >
      <svg width={50} height={50} viewBox="0 0 50 50">
        {/* Background circle */}
        <circle
          cx={25}
          cy={25}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={3}
        />
        {/* Progress circle */}
        <motion.circle
          cx={25}
          cy={25}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: smoothProgress.get()
              ? circumference * (1 - smoothProgress.get())
              : circumference,
            filter: `drop-shadow(0 0 5px ${color})`,
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
          initial={{ strokeDashoffset: circumference }}
        />
      </svg>
      {showPercentage && (
        <motion.span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.625rem',
            fontWeight: 'bold',
            color: 'var(--st-white)',
          }}
        >
          <motion.span>{Math.round(smoothProgress.get() * 100) || 0}%</motion.span>
        </motion.span>
      )}
    </div>
  );
}
