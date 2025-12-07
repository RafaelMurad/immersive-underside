import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { usePrefersReducedMotion } from '../../hooks';

interface SceneProps {
  children?: ReactNode;
  controls?: boolean;
  stars?: boolean;
  className?: string;
  cameraPosition?: [number, number, number];
}

/**
 * Base 3D scene wrapper with Canvas and common setup
 */
export function Scene({
  children,
  controls = false,
  stars = true,
  className = '',
  cameraPosition = [0, 0, 5],
}: SceneProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={`scene-container ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />

          {/* Starfield background */}
          {stars && !prefersReducedMotion && (
            <Stars
              radius={100}
              depth={50}
              count={3000}
              factor={4}
              saturation={0}
              fade
              speed={prefersReducedMotion ? 0 : 1}
            />
          )}

          {/* Optional orbit controls for development */}
          {controls && <OrbitControls enableDamping dampingFactor={0.05} />}

          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}

interface FixedSceneProps {
  children?: ReactNode;
  stars?: boolean;
}

/**
 * Fixed background 3D scene for parallax with HTML content
 */
export function FixedScene({ children, stars = true }: FixedSceneProps) {
  return (
    <div
      className="fixed-scene"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Scene stars={stars}>{children}</Scene>
    </div>
  );
}
