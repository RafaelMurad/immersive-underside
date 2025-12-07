import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { Suspense } from 'react';
import type { Group } from 'three';
import { usePrefersReducedMotion } from '../../hooks';

interface ScrollSceneProps {
  children?: ReactNode;
  htmlContent?: ReactNode;
  pages?: number;
  damping?: number;
}

/**
 * 3D scene with scroll-linked animations
 * Uses drei's ScrollControls for smooth scrolling
 */
export function ScrollScene({
  children,
  htmlContent,
  pages = 3,
  damping = 0.1,
}: ScrollSceneProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          <ScrollControls pages={pages} damping={damping}>
            {/* 3D content that responds to scroll */}
            {children}

            {/* Optional HTML content that scrolls */}
            {htmlContent && <Scroll html>{htmlContent}</Scroll>}
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

interface ScrollResponsiveModelProps {
  children: ReactNode;
  rotationFactor?: number;
  positionFactor?: number;
}

/**
 * Wrapper that makes any 3D content respond to scroll
 */
export function ScrollResponsiveModel({
  children,
  rotationFactor = Math.PI * 2,
  positionFactor = 2,
}: ScrollResponsiveModelProps) {
  const groupRef = useRef<Group>(null);
  const scroll = useScroll();
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame(() => {
    if (!groupRef.current || prefersReducedMotion) return;

    const offset = scroll.offset;

    // Rotate based on scroll
    groupRef.current.rotation.y = offset * rotationFactor;

    // Move up/down based on scroll
    groupRef.current.position.y = Math.sin(offset * Math.PI) * positionFactor;
  });

  return <group ref={groupRef}>{children}</group>;
}

interface ScrollSection3DProps {
  children: ReactNode;
  index: number;
  totalSections: number;
}

/**
 * Individual 3D section positioned along scroll
 */
export function ScrollSection3D({
  children,
  index,
  totalSections,
}: ScrollSection3DProps) {
  const groupRef = useRef<Group>(null);
  const scroll = useScroll();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { viewport } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;

    const sectionSize = 1 / totalSections;
    const sectionStart = index * sectionSize;
    const sectionEnd = sectionStart + sectionSize;
    const offset = scroll.offset;

    // Calculate visibility
    const visible = offset >= sectionStart - sectionSize && offset <= sectionEnd + sectionSize;

    if (visible && !prefersReducedMotion) {
      // Local progress within this section (0 to 1)
      const localProgress = Math.max(0, Math.min(1, (offset - sectionStart) / sectionSize));

      // Fade in/out at section boundaries
      const opacity =
        localProgress < 0.2
          ? localProgress / 0.2
          : localProgress > 0.8
          ? (1 - localProgress) / 0.2
          : 1;

      groupRef.current.visible = true;

      // Scale based on proximity to section center
      const scale = 0.8 + opacity * 0.2;
      groupRef.current.scale.set(scale, scale, scale);
    } else {
      groupRef.current.visible = visible;
    }
  });

  return (
    <group ref={groupRef} position={[0, -index * viewport.height, 0]}>
      {children}
    </group>
  );
}

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  zPosition?: number;
}

/**
 * 3D parallax layer with configurable speed
 */
export function ParallaxLayer3D({
  children,
  speed = 1,
  zPosition = 0,
}: ParallaxLayerProps) {
  const groupRef = useRef<Group>(null);
  const scroll = useScroll();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { viewport } = useThree();

  useFrame(() => {
    if (!groupRef.current || prefersReducedMotion) return;

    const offset = scroll.offset;
    groupRef.current.position.y = offset * viewport.height * speed;
  });

  return (
    <group ref={groupRef} position={[0, 0, zPosition]}>
      {children}
    </group>
  );
}
