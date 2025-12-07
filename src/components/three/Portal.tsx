import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../hooks';

interface PortalProps {
  position?: [number, number, number];
  radius?: number;
  color?: string;
  particleCount?: number;
}

/**
 * Stranger Things style portal with swirling particles
 * Like a rift to the Upside Down
 */
export function Portal({
  position = [0, 0, 0],
  radius = 2,
  color = '#ff1e1e',
  particleCount = 100,
}: PortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Generate particle positions around the portal ring
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const innerRadius = radius - 0.3;
    const outerRadius = radius + 0.3;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const r = innerRadius + Math.random() * (outerRadius - innerRadius);
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    return positions;
  }, [particleCount, radius]);

  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    return geo;
  }, [particlePositions]);

  useFrame((state) => {
    if (prefersReducedMotion) return;

    const time = state.clock.elapsedTime;

    // Rotate the entire portal slowly
    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.2;
    }

    // Animate particles in a wave pattern
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const wave = Math.sin(time * 2 + angle * 3) * 0.3;
        positions[i * 3 + 2] = wave;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Pulse the ring
    if (ringRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.05;
      ringRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer glow ring */}
      <mesh>
        <torusGeometry args={[radius + 0.1, 0.15, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          toneMapped={false}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Main portal ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.08, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={5}
          toneMapped={false}
        />
      </mesh>

      {/* Inner dark void */}
      <mesh position={[0, 0, -0.1]}>
        <circleGeometry args={[radius - 0.2, 64]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>

      {/* Swirling particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.08}
          color={color}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

interface PortalGatewayProps {
  isOpen?: boolean;
  position?: [number, number, number];
  scale?: number;
}

/**
 * Animated portal that opens/closes
 */
export function PortalGateway({
  isOpen = false,
  position = [0, 0, 0],
  scale = 1,
}: PortalGatewayProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetScale = isOpen ? scale : 0;

    if (prefersReducedMotion) {
      currentScale.current = targetScale;
    } else {
      // Smooth animation
      currentScale.current += (targetScale - currentScale.current) * delta * 3;
    }

    groupRef.current.scale.set(currentScale.current, currentScale.current, currentScale.current);
  });

  return (
    <group ref={groupRef} position={position}>
      <Portal />
    </group>
  );
}
