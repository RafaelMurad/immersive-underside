import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../hooks';

interface DustParticlesProps {
  count?: number;
  size?: number;
  color?: string;
  spread?: number;
  speed?: number;
}

/**
 * Floating dust particles for atmospheric effect
 * Like the Upside Down fog particles
 */
export function DustParticles({
  count = 500,
  size = 0.03,
  color = '#ffffff',
  spread = 20,
  speed = 0.05,
}: DustParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Generate random positions once
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return positions;
  }, [count, spread]);

  useFrame((state) => {
    if (!pointsRef.current || prefersReducedMotion) return;

    // Slow rotation for floating effect
    pointsRef.current.rotation.y = state.clock.elapsedTime * speed;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    return geo;
  }, [particles]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

interface SparklesEffectProps {
  count?: number;
  size?: number;
  radius?: number;
  color?: string;
}

/**
 * Sparkling particles that twinkle
 */
export function SparklesEffect({
  count = 100,
  size = 0.05,
  radius = 10,
  color = '#ff1e1e',
}: SparklesEffectProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.random() * radius;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }

    return pos;
  }, [count, radius]);

  useFrame((state) => {
    if (!pointsRef.current || prefersReducedMotion) return;

    const time = state.clock.elapsedTime;
    const material = pointsRef.current.material as THREE.PointsMaterial;

    // Twinkling effect by varying opacity
    material.opacity = 0.4 + Math.sin(time * 2) * 0.3;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
